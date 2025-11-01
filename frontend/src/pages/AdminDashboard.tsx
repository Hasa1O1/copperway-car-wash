import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { adminApi, authApi } from '../lib/api';
import type { Booking } from '../types';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'pending' | 'queue' | 'records' | 'stats'>('pending');
  const [pendingPayments, setPendingPayments] = useState<Booking[]>([]);
  const [queue, setQueue] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [customerHistory, setCustomerHistory] = useState<any[]>([]);
  const [serviceRecords, setServiceRecords] = useState<any[]>([]);
  const [overallStats, setOverallStats] = useState<any>(null);
  const [dailyStats, setDailyStats] = useState<any[]>([]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'pending' || activeTab === 'queue') {
        const [pending, queueData] = await Promise.all([
          adminApi.getPendingPayments(),
          adminApi.getQueue(),
        ]);
        setPendingPayments(pending);
        setQueue(queueData);
      } else if (activeTab === 'records') {
        const [customers, services] = await Promise.all([
          adminApi.getCustomerHistory(),
          adminApi.getServiceRecords(50, 0),
        ]);
        setCustomerHistory(customers);
        setServiceRecords(services.data || []);
      } else if (activeTab === 'stats') {
        const [overall, daily] = await Promise.all([
          adminApi.getOverallStats(),
          adminApi.getDailyStats(30),
        ]);
        setOverallStats(overall);
        setDailyStats(daily);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check authentication
    if (!authApi.isAuthenticated()) {
      navigate('/admin/login');
      return;
    }

    // Connect to Socket.io
    const socket = io('http://localhost:5000');
    
    socket.on('connect', () => {
      socket.emit('join:admin');
    });

    socket.on('queue:update', (data: Booking[]) => {
      setQueue(data);
    });

    socket.on('booking:status-update', () => {
      if (activeTab === 'pending' || activeTab === 'queue') {
        loadData();
      }
    });

    loadData();

    return () => {
      socket.disconnect();
    };
  }, [navigate]);

  useEffect(() => {
    if (authApi.isAuthenticated()) {
      loadData();
    }
  }, [activeTab]);

  const handleVerifyPayment = async (bookingId: number, paymentMethod: string) => {
    try {
      await adminApi.verifyPayment(bookingId, paymentMethod);
      await loadData();
    } catch (error: any) {
      alert(error.message || 'Failed to verify payment');
    }
  };

  const handleUpdateStatus = async (bookingId: number, status: string) => {
    try {
      await adminApi.updateStatus(bookingId, status);
      await loadData();
    } catch (error: any) {
      alert(error.message || 'Failed to update status');
    }
  };

  const handleLogout = () => {
    authApi.logout();
    navigate('/admin/login');
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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-6 py-2 font-semibold ${
            activeTab === 'pending'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-600'
          }`}
        >
          Pending Payments ({pendingPayments.length})
        </button>
        <button
          onClick={() => setActiveTab('queue')}
          className={`px-6 py-2 font-semibold ${
            activeTab === 'queue'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-600'
          }`}
        >
          Queue ({queue.length})
        </button>
        <button
          onClick={() => setActiveTab('records')}
          className={`px-6 py-2 font-semibold ${
            activeTab === 'records'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-600'
          }`}
        >
          Records
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-6 py-2 font-semibold ${
            activeTab === 'stats'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-600'
          }`}
        >
          Statistics
        </button>
      </div>

      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingPayments.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-600">
              No pending payments
            </div>
          ) : (
            pendingPayments.map((booking) => (
              <div key={booking.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-600">Booking Number</div>
                    <div className="font-semibold">{booking.booking_number}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Customer</div>
                    <div className="font-semibold">{booking.customer_name}</div>
                    <div className="text-sm text-gray-500">{booking.customer_phone}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Amount</div>
                    <div className="font-bold text-primary text-lg">K{booking.amount.toFixed(2)}</div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-sm text-gray-600">Service</div>
                  <div>{booking.service?.name}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(booking.scheduled_date).toLocaleDateString()} at {booking.scheduled_time}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      const method = prompt('Payment method (Mobile Money/Bank Transfer/Cash):');
                      if (method) {
                        handleVerifyPayment(booking.id, method);
                      }
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Verify Payment
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'queue' && (
        <div className="space-y-4">
          {queue.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-600">
              Queue is empty
            </div>
          ) : (
            queue.map((booking) => (
              <div key={booking.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-600">Slot #</div>
                    <div className="font-bold text-primary text-xl">{booking.slot_number}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Booking Number</div>
                    <div className="font-semibold">{booking.booking_number}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Customer</div>
                    <div className="font-semibold">{booking.customer_name}</div>
                    <div className="text-sm text-gray-500">{booking.service?.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Status</div>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                      {booking.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
                {booking.estimated_completion_time && (
                  <div className="mb-4 text-sm text-gray-600">
                    Estimated Completion: {new Date(booking.estimated_completion_time).toLocaleString()}
                  </div>
                )}
                <div className="flex space-x-2">
                  {booking.status !== 'in_progress' && (
                    <button
                      onClick={() => handleUpdateStatus(booking.id, 'in_progress')}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Start Service
                    </button>
                  )}
                  {booking.status === 'in_progress' && (
                    <button
                      onClick={() => handleUpdateStatus(booking.id, 'completed')}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'records' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Customer History</h2>
            {customerHistory.length === 0 ? (
              <p className="text-gray-600">No customer history available</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Customer</th>
                      <th className="text-left py-2">Phone</th>
                      <th className="text-left py-2">Total Visits</th>
                      <th className="text-left py-2">Completed</th>
                      <th className="text-left py-2">Total Spent</th>
                      <th className="text-left py-2">Last Visit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerHistory.map((customer, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="py-2">{customer.customer_name}</td>
                        <td className="py-2">{customer.customer_phone}</td>
                        <td className="py-2">{customer.total_visits}</td>
                        <td className="py-2">{customer.completed_visits}</td>
                        <td className="py-2">K{parseFloat(customer.total_spent || 0).toFixed(2)}</td>
                        <td className="py-2">{new Date(customer.last_visit).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Recent Service Records</h2>
            {serviceRecords.length === 0 ? (
              <p className="text-gray-600">No service records available</p>
            ) : (
              <div className="space-y-4">
                {serviceRecords.slice(0, 20).map((record: any) => (
                  <div key={record.id} className="border-b pb-4 last:border-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div>
                        <span className="text-sm text-gray-600">Customer:</span>
                        <div className="font-semibold">{record.customer_name}</div>
                        <div className="text-sm text-gray-500">{record.customer_phone}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Vehicle:</span>
                        <div className="font-semibold">{record.vehicle_model}</div>
                        <div className="text-sm text-gray-500">{record.vehicle_number_plate}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Service:</span>
                        <div className="font-semibold">{record.service_name}</div>
                        <div className="text-sm text-gray-500">K{parseFloat(record.amount || 0).toFixed(2)}</div>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      Attended: {new Date(record.attended_at).toLocaleString()} | 
                      Type: {record.service_type}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="space-y-6">
          {overallStats && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Overall Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Total Bookings</div>
                  <div className="text-3xl font-bold text-blue-600">{overallStats.total_bookings}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Completed</div>
                  <div className="text-3xl font-bold text-green-600">{overallStats.completed_bookings}</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Total Revenue</div>
                  <div className="text-3xl font-bold text-purple-600">K{parseFloat(overallStats.total_revenue || 0).toFixed(2)}</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Active Bookings</div>
                  <div className="text-3xl font-bold text-yellow-600">{overallStats.active_bookings}</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Cancelled</div>
                  <div className="text-3xl font-bold text-red-600">{overallStats.cancelled_bookings}</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Pickup Services</div>
                  <div className="text-3xl font-bold text-orange-600">{overallStats.total_pickup_services}</div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Daily Statistics (Last 30 Days)</h2>
            {dailyStats.length === 0 ? (
              <p className="text-gray-600">No statistics available</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Date</th>
                      <th className="text-right py-2">Total</th>
                      <th className="text-right py-2">Completed</th>
                      <th className="text-right py-2">Cancelled</th>
                      <th className="text-right py-2">Revenue</th>
                      <th className="text-right py-2">Pickup</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyStats.map((stat: any) => (
                      <tr key={stat.date} className="border-b hover:bg-gray-50">
                        <td className="py-2">{new Date(stat.date).toLocaleDateString()}</td>
                        <td className="py-2 text-right">{stat.total_bookings}</td>
                        <td className="py-2 text-right">{stat.completed_bookings}</td>
                        <td className="py-2 text-right">{stat.cancelled_bookings}</td>
                        <td className="py-2 text-right">K{parseFloat(stat.revenue || 0).toFixed(2)}</td>
                        <td className="py-2 text-right">{stat.pickup_services}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

