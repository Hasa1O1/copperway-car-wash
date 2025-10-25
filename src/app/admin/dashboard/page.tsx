'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminUser, Booking } from '@/types';

export default function AdminDashboard() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'queue' | 'bookings'>('pending');
  const [pendingPayments, setPendingPayments] = useState<Booking[]>([]);
  const [queueItems, setQueueItems] = useState<any[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');

    if (!token || !userData) {
      router.push('/admin/login');
      return;
    }

    setUser(JSON.parse(userData));
    loadData();
  }, [router]);

  useEffect(() => {
    if (activeTab === 'queue') {
      loadQueue();
    }
  }, [activeTab, selectedDate]);

  const loadData = async () => {
    await Promise.all([
      loadPendingPayments(),
      loadAllBookings(),
    ]);
  };

  const loadPendingPayments = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/pending-payments', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setPendingPayments(data.data);
      }
    } catch (error) {
      console.error('Error loading pending payments:', error);
    }
  };

  const loadQueue = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/queue?date=${selectedDate}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setQueueItems(data.data);
      }
    } catch (error) {
      console.error('Error loading queue:', error);
    }
  };

  const loadAllBookings = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setAllBookings(data.data);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  const verifyPayment = async (bookingId: number, verified: boolean, notes?: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/verify-payment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          verified,
          notes,
        }),
      });

      const data = await response.json();
      if (data.success) {
        await loadPendingPayments();
        await loadQueue();
      } else {
        alert(data.error || 'Failed to verify payment');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      alert('Failed to verify payment');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: number, status: string, notes?: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/update-status', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          status,
          notes,
        }),
      });

      const data = await response.json();
      if (data.success) {
        await loadData();
        await loadQueue();
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.fullName}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Role: {user.role}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Pending Payments ({pendingPayments.length})
            </button>
            <button
              onClick={() => setActiveTab('queue')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'queue'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Queue Management
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'bookings'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              All Bookings ({allBookings.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Pending Payments Tab */}
        {activeTab === 'pending' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Pending Payment Verifications</h2>
            {pendingPayments.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <p className="text-gray-600">No pending payments to verify.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingPayments.map((booking) => (
                  <div key={booking.id} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {booking.bookingNumber}
                        </h3>
                        <p className="text-gray-600">{booking.customerName} - {booking.customerPhone}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Service Details</h4>
                        <p className="text-sm text-gray-600">
                          <strong>Service:</strong> {booking.service?.name}<br />
                          <strong>Date:</strong> {new Date(booking.scheduledDate).toLocaleDateString()}<br />
                          <strong>Time:</strong> {new Date(booking.scheduledTime).toLocaleTimeString()}<br />
                          <strong>Amount:</strong> ${booking.amount.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Vehicle Details</h4>
                        <p className="text-sm text-gray-600">
                          <strong>Model:</strong> {booking.vehicleModel}<br />
                          <strong>License Plate:</strong> {booking.vehicleNumberPlate}<br />
                          {booking.pickupRequired && (
                            <>
                              <strong>Pickup:</strong> Yes<br />
                              {booking.pickupAddress && (
                                <><strong>Address:</strong> {booking.pickupAddress}</>
                              )}
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        onClick={() => verifyPayment(booking.id, true)}
                        disabled={loading}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                      >
                        Verify Payment
                      </button>
                      <button
                        onClick={() => {
                          const notes = prompt('Enter rejection notes:');
                          if (notes) {
                            verifyPayment(booking.id, false, notes);
                          }
                        }}
                        disabled={loading}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                      >
                        Reject Payment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Queue Management Tab */}
        {activeTab === 'queue' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Queue Management</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {queueItems.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <p className="text-gray-600">No bookings in queue for this date.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {queueItems.map((item, index) => (
                  <div key={item.booking.id} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          #{item.position} - {item.booking.bookingNumber}
                        </h3>
                        <p className="text-gray-600">{item.booking.customerName} - {item.booking.customerPhone}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.booking.status)}`}>
                        {getStatusText(item.booking.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Service</h4>
                        <p className="text-sm text-gray-600">
                          {item.booking.service?.name}<br />
                          ${item.booking.amount.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Vehicle</h4>
                        <p className="text-sm text-gray-600">
                          {item.booking.vehicleModel}<br />
                          {item.booking.vehicleNumberPlate}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Timing</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(item.booking.scheduledTime).toLocaleTimeString()}<br />
                          Est: {new Date(item.estimatedStartTime).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {item.booking.status === 'PAYMENT_VERIFIED' && (
                        <button
                          onClick={() => updateBookingStatus(item.booking.id, 'IN_QUEUE')}
                          disabled={loading}
                          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors disabled:opacity-50"
                        >
                          Add to Queue
                        </button>
                      )}
                      {item.booking.status === 'IN_QUEUE' && (
                        <button
                          onClick={() => updateBookingStatus(item.booking.id, 'IN_PROGRESS')}
                          disabled={loading}
                          className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600 transition-colors disabled:opacity-50"
                        >
                          Start Service
                        </button>
                      )}
                      {item.booking.status === 'IN_PROGRESS' && (
                        <button
                          onClick={() => updateBookingStatus(item.booking.id, 'COMPLETED')}
                          disabled={loading}
                          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* All Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">All Bookings</h2>
            {allBookings.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <p className="text-gray-600">No bookings found.</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Booking
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Service
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date/Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {allBookings.map((booking) => (
                        <tr key={booking.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {booking.bookingNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {booking.customerName}<br />
                            {booking.customerPhone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {booking.service?.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(booking.scheduledDate).toLocaleDateString()}<br />
                            {new Date(booking.scheduledTime).toLocaleTimeString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                              {getStatusText(booking.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${booking.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
