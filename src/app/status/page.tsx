'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Booking } from '@/types';

export default function StatusPage() {
  const [bookingNumber, setBookingNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchBooking = async () => {
    if (!bookingNumber && !phone) {
      setError('Please enter either booking number or phone number');
      return;
    }

    setLoading(true);
    setError('');
    setBooking(null);

    try {
      const params = new URLSearchParams();
      if (bookingNumber) params.append('bookingNumber', bookingNumber);
      if (phone) params.append('phone', phone);

      const response = await fetch(`/api/bookings/search?${params}`);
      const data = await response.json();

      if (data.success) {
        setBooking(data.data);
      } else {
        setError(data.error || 'Booking not found');
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      setError('Failed to fetch booking details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return 'bg-yellow-100 text-yellow-800';
      case 'PAYMENT_VERIFIED':
        return 'bg-blue-100 text-blue-800';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'IN_QUEUE':
        return 'bg-purple-100 text-purple-800';
      case 'IN_PROGRESS':
        return 'bg-orange-100 text-orange-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return 'Pending Payment';
      case 'PAYMENT_VERIFIED':
        return 'Payment Verified';
      case 'CONFIRMED':
        return 'Confirmed';
      case 'IN_QUEUE':
        return 'In Queue';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'COMPLETED':
        return 'Completed';
      case 'CANCELLED':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 bg-white shadow-md z-50">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="text-2xl font-bold text-primary">Copperway Car Wash</div>
          <nav>
            <ul className="flex space-x-6">
              <li><Link href="/" className="hover:text-primary">Home</Link></li>
              <li><Link href="/booking" className="hover:text-primary">Book Now</Link></li>
              <li><Link href="/status" className="text-primary font-semibold">Check Status</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Check Booking Status</h1>

        {/* Search Form */}
        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Find Your Booking</h2>
          
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
          </div>

          <button
            onClick={searchBooking}
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors mt-6"
          >
            {loading ? 'Searching...' : 'Search Booking'}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Booking Details */}
        {booking && (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Booking Details</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                {getStatusText(booking.status)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Booking Information</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Booking Number:</span> {booking.bookingNumber}</p>
                  <p><span className="font-medium">Service:</span> {booking.service?.name}</p>
                  <p><span className="font-medium">Date:</span> {new Date(booking.scheduledDate).toLocaleDateString()}</p>
                  <p><span className="font-medium">Time:</span> {new Date(booking.scheduledTime).toLocaleTimeString()}</p>
                  <p><span className="font-medium">Amount:</span> ${booking.amount.toFixed(2)}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Vehicle Information</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Model:</span> {booking.vehicleModel}</p>
                  <p><span className="font-medium">License Plate:</span> {booking.vehicleNumberPlate}</p>
                  {booking.pickupRequired && (
                    <>
                      <p><span className="font-medium">Pickup:</span> Yes</p>
                      {booking.pickupAddress && (
                        <p><span className="font-medium">Pickup Address:</span> {booking.pickupAddress}</p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {booking.slotNumber && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Queue Information</h3>
                <p className="text-blue-700">
                  <span className="font-medium">Slot Number:</span> {booking.slotNumber}
                </p>
                {booking.estimatedCompletionTime && (
                  <p className="text-blue-700">
                    <span className="font-medium">Estimated Completion:</span>{' '}
                    {new Date(booking.estimatedCompletionTime).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {booking.status === 'PENDING_PAYMENT' && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">Payment Required</h3>
                <p className="text-yellow-700 mb-3">
                  Your booking is pending payment verification. Please complete your payment using one of the methods below:
                </p>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Mobile Money: +260 123 456789</li>
                  <li>• Bank Transfer: Available on request</li>
                  <li>• Cash Payment: At location</li>
                </ul>
                <p className="text-sm text-yellow-600 mt-2">
                  After payment, contact us at +260 123 456789 for verification.
                </p>
              </div>
            )}

            {booking.status === 'COMPLETED' && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Service Completed</h3>
                <p className="text-green-700">
                  Your car wash service has been completed successfully. Thank you for choosing Copperway Car Wash!
                </p>
                {booking.completedAt && (
                  <p className="text-sm text-green-600 mt-2">
                    Completed on: {new Date(booking.completedAt).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {/* Google Maps Integration */}
            <div className="mt-6">
              <h3 className="font-semibold text-gray-700 mb-3">Location</h3>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-600 mb-2">Copperway Car Wash</p>
                <p className="text-gray-600 mb-3">Kitwe, Zambia</p>
                <a
                  href="https://maps.google.com/?q=-12.8153,28.2139"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <Link 
            href="/booking" 
            className="text-primary hover:text-blue-600 transition-colors"
          >
            Make Another Booking
          </Link>
        </div>
      </div>
    </div>
  );
}
