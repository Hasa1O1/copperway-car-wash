import { useState } from 'react';
import { bookingsApi } from '../lib/api';
import type { Booking } from '../types';

export default function StatusPage() {
  const [bookingNumber, setBookingNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!bookingNumber && !phone) {
      setError('Please enter booking number or phone number');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await bookingsApi.search(bookingNumber || undefined, phone || undefined);
      setBooking(data);
    } catch (err: any) {
      setError(err.message || 'Booking not found');
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'in_queue':
        return 'bg-yellow-100 text-yellow-800';
      case 'payment_verified':
      case 'confirmed':
        return 'bg-purple-100 text-purple-800';
      case 'pending_payment':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Check Booking Status</h1>

      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Booking Number</label>
            <input
              type="text"
              value={bookingNumber}
              onChange={(e) => setBookingNumber(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., CW202501011234"
            />
          </div>
          <div className="text-center text-gray-500">OR</div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter your phone number"
            />
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors"
          >
            {loading ? 'Searching...' : 'Check Status'}
          </button>
        </div>
      </div>

      {booking && (
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Booking Details</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Booking Number:</span>
              <span>{booking.booking_number}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-medium">Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                {booking.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Service:</span>
              <span>{booking.service?.name}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Date:</span>
              <span>{new Date(booking.scheduled_date).toLocaleDateString()}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Time:</span>
              <span>{booking.scheduled_time}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Amount:</span>
              <span className="font-bold text-primary">K{booking.amount.toFixed(2)}</span>
            </div>

            {booking.slot_number && (
              <div className="flex justify-between">
                <span className="font-medium">Slot Number:</span>
                <span className="font-semibold text-primary">#{booking.slot_number}</span>
              </div>
            )}

            {booking.estimated_completion_time && (
              <div className="flex justify-between">
                <span className="font-medium">Estimated Completion:</span>
                <span>{new Date(booking.estimated_completion_time).toLocaleString()}</span>
              </div>
            )}

            {booking.pickup_required && booking.pickup_address && (
              <div>
                <span className="font-medium">Pickup Address:</span>
                <p className="text-gray-600 mt-1">{booking.pickup_address}</p>
              </div>
            )}

            {!booking.payment_confirmed && (
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h3 className="font-semibold text-yellow-800 mb-2">Payment Required</h3>
                <p className="text-sm text-yellow-700 mb-2">
                  Please complete your payment to confirm your booking slot.
                </p>
                <p className="text-sm text-yellow-700">
                  Payment Methods: Mobile Money: 0974323234 | WhatsApp: +26076977857
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

