import { Express } from 'express';
import serviceRoutes from './services';
import bookingRoutes from './bookings';
import authRoutes from './auth';
import adminRoutes from './admin';
import slotRoutes from './slots';

export function setupRoutes(app: Express) {
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Copperway Car Wash API' });
  });

  app.use('/api/services', serviceRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/slots', slotRoutes);
}

