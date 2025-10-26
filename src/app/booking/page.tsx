'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Service, CreateBookingRequest, Booking } from '@/types';

export default function BookingPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState<Partial<CreateBookingRequest>>({});
  const [bookingResult, setBookingResult] = useState<Booking | null>(null);

  // Load services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      const data = await response.json();
      if (data.success) {
        setServices(data.data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchTimeSlots = async (date: string, serviceId: number) => {
    try {
      const response = await fetch(`/api/slots?date=${date}&serviceId=${serviceId}`);
      const data = await response.json();
      if (data.success) {
        setTimeSlots(data.data.map((slot: any) => slot.time));
      }
    } catch (error) {
      console.error('Error fetching time slots:', error);
    }
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setBookingData(prev => ({ ...prev, serviceId: service.id }));
  };

  const handleDateSelect = (date: string) => {
    setBookingData(prev => ({ ...prev, scheduledDate: date }));
    if (selectedService) {
      fetchTimeSlots(date, selectedService.id);
    }
  };

  const handleTimeSelect = (time: string) => {
    setBookingData(prev => ({ ...prev, scheduledTime: time }));
  };

  const handleInputChange = (field: keyof CreateBookingRequest, value: string | boolean) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!bookingData.serviceId || !bookingData.customerName || !bookingData.customerPhone || 
        !bookingData.vehicleModel || !bookingData.vehicleNumberPlate || 
        !bookingData.scheduledDate || !bookingData.scheduledTime) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();
      if (data.success) {
        setBookingResult(data.data);
        setCurrentStep(5); // Success step
      } else {
        alert(data.error || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && selectedService) {
      setCurrentStep(2);
    } else if (currentStep === 2 && bookingData.scheduledDate && bookingData.scheduledTime) {
      setCurrentStep(3);
    } else if (currentStep === 3 && bookingData.customerName && bookingData.customerPhone && 
               bookingData.vehicleModel && bookingData.vehicleNumberPlate) {
      setCurrentStep(4);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (bookingResult) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="sticky top-0 bg-white shadow-md z-50">
          <div className="container mx-auto flex justify-between items-center p-4">
            <div className="text-2xl font-bold text-primary">Copperway Car Wash</div>
            <nav>
              <ul className="flex space-x-6">
                <li><Link href="/" className="hover:text-primary">Home</Link></li>
                <li><Link href="/booking" className="text-primary font-semibold">Book Now</Link></li>
                <li><Link href="/status" className="hover:text-primary">Check Status</Link></li>
              </ul>
            </nav>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Booking Confirmed!</h1>
            <p className="text-lg text-gray-600 mb-6">
              Your booking has been created successfully. Please complete your payment to confirm your slot.
            </p>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold mb-4">Booking Details</h3>
              <div className="text-left space-y-2">
                <p><strong>Booking Number:</strong> {bookingResult.bookingNumber}</p>
                <p><strong>Service:</strong> {bookingResult.service?.name}</p>
                <p><strong>Date:</strong> {new Date(bookingResult.scheduledDate).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {new Date(bookingResult.scheduledTime).toLocaleTimeString()}</p>
                <p><strong>Amount:</strong> ${bookingResult.amount.toFixed(2)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <Link 
                href="/status" 
                className="block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                Check Booking Status
              </Link>
              <Link 
                href="/booking" 
                className="block text-primary hover:text-blue-600 transition-colors"
              >
                Make Another Booking
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 bg-white shadow-md z-50">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="text-2xl font-bold text-primary">Copperway Car Wash</div>
          <nav>
            <ul className="flex space-x-6">
              <li><Link href="/" className="hover:text-primary">Home</Link></li>
              <li><Link href="/booking" className="text-primary font-semibold">Book Now</Link></li>
              <li><Link href="/status" className="hover:text-primary">Check Status</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Book Your Car Wash</h1>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= step ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step ? 'bg-primary' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <div className="text-sm text-gray-600">
              {currentStep === 1 && 'Select Service'}
              {currentStep === 2 && 'Choose Date & Time'}
              {currentStep === 3 && 'Vehicle Details'}
              {currentStep === 4 && 'Contact & Payment'}
            </div>
          </div>
        </div>

        {/* Step 1: Service Selection */}
        {currentStep === 1 && (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">1. Select Service</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Choose a Service *</label>
              <select
                value={selectedService?.id || ''}
                onChange={(e) => {
                  const serviceId = parseInt(e.target.value);
                  const service = services.find(s => s.id === serviceId);
                  if (service) {
                    handleServiceSelect(service);
                  }
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">-- Select a service --</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - K{service.price.toFixed(2)} ({service.duration} min)
                  </option>
                ))}
              </select>
            </div>

            {selectedService && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-gray-800 mb-2">{selectedService.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{selectedService.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-primary">K{selectedService.price.toFixed(2)}</span>
                  <span className="text-gray-500">{selectedService.duration} min</span>
                </div>
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={nextStep}
                disabled={!selectedService}
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
              >
                Next: Choose Date & Time
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Date & Time Selection */}
        {currentStep === 2 && (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">2. Choose Date & Time</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => handleDateSelect(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {timeSlots.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleTimeSelect(time)}
                      className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                        bookingData.scheduledTime === time
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-300 hover:border-primary'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                onClick={prevStep}
                className="px-6 py-3 border border-primary text-primary rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={nextStep}
                disabled={!bookingData.scheduledDate || !bookingData.scheduledTime}
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
              >
                Next: Vehicle Details
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Vehicle Details */}
        {currentStep === 3 && (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">3. Vehicle Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Model *</label>
                <input
                  type="text"
                  required
                  onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., Toyota Camry"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">License Plate *</label>
                <input
                  type="text"
                  required
                  onChange={(e) => handleInputChange('vehicleNumberPlate', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., ABC-1234"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  onChange={(e) => handleInputChange('pickupRequired', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">I need pickup service</span>
              </label>
            </div>

            {bookingData.pickupRequired && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Address</label>
                  <textarea
                    onChange={(e) => handleInputChange('pickupAddress', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={3}
                    placeholder="Enter pickup address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Drop-off Address (Optional)</label>
                  <textarea
                    onChange={(e) => handleInputChange('dropoffAddress', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={3}
                    placeholder="Enter drop-off address (leave blank if same as pickup)"
                  />
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                onClick={prevStep}
                className="px-6 py-3 border border-primary text-primary rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={nextStep}
                disabled={!bookingData.vehicleModel || !bookingData.vehicleNumberPlate}
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
              >
                Next: Contact & Payment
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Contact & Payment */}
        {currentStep === 4 && (
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">4. Contact Information & Payment</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  required
                  onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address (Optional)</label>
              <input
                type="email"
                onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your email address"
              />
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Service: {selectedService?.name}</span>
                  <span>K{selectedService?.price.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Amount:</span>
                    <span className="text-primary">K{selectedService?.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Payment Methods:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Mobile Money: 0974323234</li>
                  <li>• WhatsApp: +26076977857</li>
                  <li>• Supervisor: +260972297220</li>
                  <li>• Cash Payment: At location</li>
                </ul>
                <p className="text-sm text-blue-600 mt-2">
                  After payment, upload your screenshot or contact us for verification.
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={prevStep}
                className="px-6 py-3 border border-primary text-primary rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !bookingData.customerName || !bookingData.customerPhone}
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
              >
                {loading ? 'Creating Booking...' : 'Complete Booking'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
