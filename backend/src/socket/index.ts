import { Server } from 'socket.io';
import { pool } from '../config/database';

export function setupSocketIO(io: Server) {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join admin room
    socket.on('join:admin', () => {
      socket.join('admin');
      console.log('Client joined admin room');
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}

// Function to emit queue updates
export async function emitQueueUpdate(io: Server) {
  try {
    const result = await pool.query(
      `SELECT b.*, s.name as service_name 
       FROM bookings b 
       JOIN services s ON b.service_id = s.id 
       WHERE b.status IN ('payment_verified', 'confirmed', 'in_queue', 'in_progress') 
       ORDER BY b.slot_number ASC, b.scheduled_date ASC, b.scheduled_time ASC`
    );

    io.to('admin').emit('queue:update', result.rows);
  } catch (error) {
    console.error('Error emitting queue update:', error);
  }
}

// Function to emit booking status update
export function emitBookingStatusUpdate(io: Server, bookingNumber: string, status: string) {
  io.emit('booking:status-update', { bookingNumber, status });
}

