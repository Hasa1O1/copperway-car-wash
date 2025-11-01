import { Router, Request, Response } from 'express';
import { pool } from '../config/database';

const router = Router();

// Create booking
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      serviceId,
      customerName,
      customerPhone,
      customerEmail,
      vehicleModel,
      vehicleNumberPlate,
      scheduledDate,
      scheduledTime,
      pickupRequired,
      pickupAddress,
      pickupLatitude,
      pickupLongitude,
      dropoffAddress,
      dropoffLatitude,
      dropoffLongitude,
    } = req.body;

    if (!serviceId || !customerName || !customerPhone || !vehicleModel || !vehicleNumberPlate || !scheduledDate || !scheduledTime) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Get service price
    const serviceResult = await pool.query('SELECT price FROM services WHERE id = $1', [serviceId]);
    if (serviceResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }
    const amount = serviceResult.rows[0].price;

    // Generate booking number
    const datePrefix = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingNumber = `CW${datePrefix}${randomSuffix}`;

    const result = await pool.query(
      `INSERT INTO bookings (
        booking_number, customer_name, customer_phone, customer_email,
        vehicle_model, vehicle_number_plate, service_id,
        scheduled_date, scheduled_time, pickup_required,
        pickup_address, pickup_latitude, pickup_longitude,
        dropoff_address, dropoff_latitude, dropoff_longitude,
        amount, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, 'pending_payment')
      RETURNING *`,
      [
        bookingNumber, customerName, customerPhone, customerEmail || null,
        vehicleModel, vehicleNumberPlate, serviceId,
        scheduledDate, scheduledTime, pickupRequired || false,
        pickupAddress || null, pickupLatitude || null, pickupLongitude || null,
        dropoffAddress || null, dropoffLatitude || null, dropoffLongitude || null,
        amount, 'pending_payment'
      ]
    );

    // Get service details for response
    const serviceDetailResult = await pool.query('SELECT * FROM services WHERE id = $1', [serviceId]);
    const booking = result.rows[0];
    booking.service = serviceDetailResult.rows[0];

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error: any) {
    console.error('Error creating booking:', error);
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({ success: false, error: 'Booking number already exists. Please try again.' });
    }
    res.status(500).json({ success: false, error: 'Failed to create booking' });
  }
});

// Get booking by booking number
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { bookingNumber, phone } = req.query;

    if (!bookingNumber && !phone) {
      return res.status(400).json({ success: false, error: 'Booking number or phone required' });
    }

    let query = 'SELECT b.*, s.name as service_name, s.description as service_description, s.price as service_price, s.duration FROM bookings b JOIN services s ON b.service_id = s.id WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (bookingNumber) {
      query += ` AND b.booking_number = $${paramCount}`;
      params.push(bookingNumber);
      paramCount++;
    }

    if (phone) {
      query += ` AND b.customer_phone = $${paramCount}`;
      params.push(phone);
      paramCount++;
    }

    query += ' ORDER BY b.created_at DESC LIMIT 1';

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    const booking = result.rows[0];
    booking.service = {
      id: booking.service_id,
      name: booking.service_name,
      description: booking.service_description,
      price: booking.service_price,
      duration: booking.duration,
    };

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch booking' });
  }
});

// Get booking by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT b.*, s.name as service_name, s.description as service_description, s.price as service_price, s.duration 
       FROM bookings b 
       JOIN services s ON b.service_id = s.id 
       WHERE b.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    const booking = result.rows[0];
    booking.service = {
      id: booking.service_id,
      name: booking.service_name,
      description: booking.service_description,
      price: booking.service_price,
      duration: booking.duration,
    };

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch booking' });
  }
});

export default router;
