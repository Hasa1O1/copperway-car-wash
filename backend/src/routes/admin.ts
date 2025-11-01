import { Router, Response } from 'express';
import { pool } from '../config/database';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth';
import { addMinutes } from 'date-fns';
import { emitQueueUpdate, emitBookingStatusUpdate } from '../socket';
import { io } from '../index';

const router = Router();

// All admin routes require authentication
router.use(authenticateToken);

// Get pending payments
router.get('/pending-payments', requireRole('admin', 'staff', 'customer_service'), async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT b.*, s.name as service_name, s.description as service_description 
       FROM bookings b 
       JOIN services s ON b.service_id = s.id 
       WHERE b.status = 'pending_payment' 
       ORDER BY b.created_at DESC`
    );

    res.json({
      success: true,
      data: result.rows.map(booking => ({
        ...booking,
        service: {
          id: booking.service_id,
          name: booking.service_name,
          description: booking.service_description,
        },
      })),
    });
  } catch (error) {
    console.error('Error fetching pending payments:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch pending payments' });
  }
});

// Verify payment
router.post('/verify-payment', requireRole('admin', 'staff', 'customer_service'), async (req: AuthRequest, res: Response) => {
  try {
    const { bookingId, paymentMethod, notes } = req.body;

    if (!bookingId) {
      return res.status(400).json({ success: false, error: 'Booking ID required' });
    }

    // Get booking details
    const bookingResult = await pool.query(
      `SELECT b.*, s.duration FROM bookings b 
       JOIN services s ON b.service_id = s.id 
       WHERE b.id = $1`,
      [bookingId]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    const booking = bookingResult.rows[0];

    // Calculate slot number (get next available slot)
    const queueResult = await pool.query(
      `SELECT COALESCE(MAX(slot_number), 0) as max_slot 
       FROM bookings 
       WHERE scheduled_date = $1 AND status IN ('payment_verified', 'confirmed', 'in_queue', 'in_progress')`,
      [booking.scheduled_date]
    );
    const slotNumber = parseInt(queueResult.rows[0].max_slot || '0') + 1;

    // Calculate estimated completion time
    const scheduledDateTime = new Date(`${booking.scheduled_date}T${booking.scheduled_time}`);
    const estimatedCompletion = addMinutes(scheduledDateTime, booking.duration);

    // Update booking
    await pool.query(
      `UPDATE bookings 
       SET status = 'payment_verified',
           payment_confirmed = TRUE,
           payment_method = $1,
           payment_notes = $2,
           slot_number = $3,
           estimated_completion_time = $4,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5`,
      [paymentMethod || null, notes || null, slotNumber, estimatedCompletion, bookingId]
    );

    // Log status change
    await pool.query(
      `INSERT INTO queue_history (booking_id, status_change, changed_by, notes) 
       VALUES ($1, 'payment_verified', $2, $3)`,
      [bookingId, req.user?.id, notes || null]
    );

    // Emit socket events
    await emitQueueUpdate(io);
    emitBookingStatusUpdate(io, booking.booking_number, 'payment_verified');

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: { slotNumber, estimatedCompletionTime: estimatedCompletion },
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, error: 'Failed to verify payment' });
  }
});

// Get queue
router.get('/queue', requireRole('admin', 'staff', 'customer_service'), async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT b.*, s.name as service_name, s.description as service_description 
       FROM bookings b 
       JOIN services s ON b.service_id = s.id 
       WHERE b.status IN ('payment_verified', 'confirmed', 'in_queue', 'in_progress') 
       ORDER BY b.slot_number ASC, b.scheduled_date ASC, b.scheduled_time ASC`
    );

    res.json({
      success: true,
      data: result.rows.map(booking => ({
        ...booking,
        service: {
          id: booking.service_id,
          name: booking.service_name,
          description: booking.service_description,
        },
      })),
    });
  } catch (error) {
    console.error('Error fetching queue:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch queue' });
  }
});

// Update booking status
router.put('/update-status', requireRole('admin', 'staff'), async (req: AuthRequest, res: Response) => {
  try {
    const { bookingId, status, notes } = req.body;

    if (!bookingId || !status) {
      return res.status(400).json({ success: false, error: 'Booking ID and status required' });
    }

    const validStatuses = ['pending_payment', 'payment_verified', 'confirmed', 'in_queue', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    // If status is completed, set completed_at timestamp
    const updateQuery = status === 'completed' 
      ? `UPDATE bookings SET status = $1, completed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $2`
      : `UPDATE bookings SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`;

    await pool.query(updateQuery, [status, bookingId]);

    // Log status change
    await pool.query(
      `INSERT INTO queue_history (booking_id, status_change, changed_by, notes) 
       VALUES ($1, $2, $3, $4)`,
      [bookingId, status, req.user?.id, notes || null]
    );

    // Get booking number for socket emit
    const bookingResult = await pool.query('SELECT booking_number FROM bookings WHERE id = $1', [bookingId]);
    
    // Emit socket events
    await emitQueueUpdate(io);
    if (bookingResult.rows.length > 0) {
      emitBookingStatusUpdate(io, bookingResult.rows[0].booking_number, status);
    }

    res.json({
      success: true,
      message: 'Status updated successfully',
    });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ success: false, error: 'Failed to update status' });
  }
});

// Get customer history
router.get('/records/customers', requireRole('admin', 'staff'), async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT * FROM customer_history
      ORDER BY last_visit DESC
      LIMIT 100
    `);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching customer history:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch customer history' });
  }
});

// Get service records
router.get('/records/services', requireRole('admin', 'staff'), async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 100, offset = 0 } = req.query;
    
    const result = await pool.query(`
      SELECT * FROM service_records
      ORDER BY attended_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    const countResult = await pool.query('SELECT COUNT(*) FROM service_records');

    res.json({
      success: true,
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
    });
  } catch (error) {
    console.error('Error fetching service records:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch service records' });
  }
});

// Get daily statistics
router.get('/stats/daily', requireRole('admin', 'staff'), async (req: AuthRequest, res: Response) => {
  try {
    const { days = 30 } = req.query;
    
    const result = await pool.query(`
      SELECT * FROM daily_stats
      ORDER BY date DESC
      LIMIT $1
    `, [days]);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching daily stats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch daily stats' });
  }
});

// Get overall statistics
router.get('/stats/overall', requireRole('admin', 'staff'), async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_bookings,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_bookings,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_bookings,
        SUM(CASE WHEN status IN ('pending_payment', 'payment_verified', 'confirmed', 'in_queue', 'in_progress') THEN 1 ELSE 0 END) as active_bookings,
        SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as total_revenue,
        AVG(CASE WHEN status = 'completed' AND completed_at IS NOT NULL THEN 
          EXTRACT(EPOCH FROM (completed_at - created_at))/60 
          ELSE NULL END) as avg_completion_time_minutes,
        SUM(CASE WHEN pickup_required THEN 1 ELSE 0 END) as total_pickup_services
      FROM bookings
    `);

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching overall stats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch overall stats' });
  }
});

// Get records by customer phone
router.get('/records/customer/:phone', requireRole('admin', 'staff'), async (req: AuthRequest, res: Response) => {
  try {
    const { phone } = req.params;
    
    const result = await pool.query(`
      SELECT b.*, s.name as service_name, s.description as service_description
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      WHERE b.customer_phone = $1
      ORDER BY b.created_at DESC
    `, [phone]);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching customer records:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch customer records' });
  }
});

export default router;

