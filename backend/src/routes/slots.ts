import { Router, Request, Response } from 'express';
import { pool } from '../config/database';
import { parse, format, addMinutes } from 'date-fns';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { date, serviceId } = req.query;

    if (!date || !serviceId) {
      return res.status(400).json({ success: false, error: 'Date and serviceId are required' });
    }

    // Get service duration
    const serviceResult = await pool.query('SELECT duration FROM services WHERE id = $1', [serviceId]);
    if (serviceResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }
    const duration = serviceResult.rows[0].duration;

    // Get business hours for the day
    const selectedDate = new Date(date as string);
    const dayOfWeek = selectedDate.getDay();
    const hoursResult = await pool.query(
      'SELECT open_time, close_time FROM business_hours WHERE day_of_week = $1 AND is_open = TRUE',
      [dayOfWeek]
    );

    if (hoursResult.rows.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const { open_time, close_time } = hoursResult.rows[0];

    // Get existing bookings for the date
    const bookingsResult = await pool.query(
      `SELECT scheduled_time, service_id, 
       (SELECT duration FROM services WHERE id = bookings.service_id) as duration
       FROM bookings 
       WHERE scheduled_date = $1 AND status NOT IN ('cancelled', 'completed')`,
      [date]
    );

    // Generate time slots (every 30 minutes)
    const slots: string[] = [];
    const [openHour, openMin] = open_time.split(':').map(Number);
    const [closeHour, closeMin] = close_time.split(':').map(Number);
    
    const baseDate = new Date(selectedDate);
    const openTime = new Date(baseDate);
    openTime.setHours(openHour, openMin, 0, 0);
    const closeTime = new Date(baseDate);
    closeTime.setHours(closeHour, closeMin, 0, 0);
    
    let currentTime = new Date(openTime);

    while (currentTime < closeTime) {
      const slotEnd = addMinutes(currentTime, duration);
      
      // Check if slot conflicts with existing bookings
      let isAvailable = true;
      for (const booking of bookingsResult.rows) {
        const [bookHour, bookMin] = booking.scheduled_time.split(':').map(Number);
        const bookingStart = new Date(baseDate);
        bookingStart.setHours(bookHour, bookMin, 0, 0);
        
        const bookingEnd = addMinutes(bookingStart, parseInt(booking.duration));
        
        if ((currentTime < bookingEnd && slotEnd > bookingStart)) {
          isAvailable = false;
          break;
        }
      }

      if (isAvailable && slotEnd <= closeTime) {
        slots.push(format(currentTime, 'HH:mm'));
      }

      currentTime = addMinutes(currentTime, 30);
    }

    res.json({
      success: true,
      data: slots.map(slot => ({ time: slot })),
    });
  } catch (error) {
    console.error('Error fetching slots:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch time slots' });
  }
});

// Get location settings
router.get('/location', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT * FROM location_settings 
      WHERE is_active = TRUE 
      ORDER BY created_at DESC 
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'No location settings found' });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch location' });
  }
});

export default router;

