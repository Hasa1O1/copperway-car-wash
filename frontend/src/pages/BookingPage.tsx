import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicesApi, bookingsApi, slotsApi, locationApi } from '../lib/api';
import type { Service, CreateBookingRequest, Booking } from '../types';
import LocationPicker from '../components/LocationPicker';

export default function BookingPage() {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState<Partial<CreateBookingRequest>>({});
  const [bookingResult, setBookingResult] = useState<Booking | null>(null);
  const [location, setLocation] = useState<any>(null);

  useEffect(() => {
    loadServices();
    loadLocation();
  }, []);

  const loadLocation = async () => {
    try {
      const data = await locationApi.getLocation();
      setLocation(data);
    } catch (error) {
      console.error('Error loading location:', error);
    }
  };

  const loadServices = async () => {
    try {
      const data = await servicesApi.getAll();
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setBookingData(prev => ({ ...prev, serviceId: service.id }));
  };

  const handleDateSelect = async (date: string) => {
    setBookingData(prev => ({ ...prev, scheduledDate: date }));
    if (selectedService) {
      try {
        const slots = await slotsApi.getAvailable(date, selectedService.id);
        setTimeSlots(slots.map(s => s.time));
      } catch (error) {
        console.error('Error fetching slots:', error);
        setTimeSlots([]);
      }
    }
  };

  const handleTimeSelect = (time: string) => {
    setBookingData(prev => ({ ...prev, scheduledTime: time }));
  };

  const handleInputChange = (field: keyof CreateBookingRequest, value: any) => {
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
      const booking = await bookingsApi.create(bookingData as CreateBookingRequest);
      setBookingResult(booking);
      setCurrentStep(5);
    } catch (error: any) {
      alert(error.message || 'Failed to create booking');
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
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Booking Confirmed!</h1>
          <p className="text-lg text-gray-600 mb-6">
            Your booking has been created successfully. Please complete your payment to confirm your slot.
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-6 text-left">
            <h3 className="text-xl font-semibold mb-4">Booking Details</h3>
            <div className="space-y-2">
              <p><strong>Booking Number:</strong> {bookingResult.booking_number}</p>
              <p><strong>Service:</strong> {bookingResult.service?.name}</p>
              <p><strong>Date:</strong> {new Date(bookingResult.scheduled_date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {bookingResult.scheduled_time}</p>
              <p><strong>Amount:</strong> K{bookingResult.amount.toFixed(2)}</p>
              {!bookingResult.pickup_required && location && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm mb-2"><strong>Location:</strong></p>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors text-sm"
                  >
                    📍 Get Directions to {location.name}
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => navigate('/status')}
              className="block w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              Check Booking Status
            </button>
            <button
              onClick={() => {
                setBookingResult(null);
                setCurrentStep(1);
                setBookingData({});
              }}
              className="block w-full text-primary hover:text-primary-dark transition-colors"
            >
              Make Another Booking
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
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
      </div>

      {/* Step 1: Service Selection */}
      {currentStep === 1 && (
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">1. Select Service</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => handleServiceSelect(service)}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  selectedService?.id === service.id
                    ? 'border-primary bg-blue-50'
                    : 'border-gray-300 hover:border-primary'
                }`}
              >
                <h3 className="font-semibold text-gray-800 mb-2">{service.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-primary">K{service.price.toFixed(2)}</span>
                  <span className="text-gray-500">{service.duration} min</span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6">
            <button
              onClick={nextStep}
              disabled={!selectedService}
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors"
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
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors"
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
            <LocationPicker
              onLocationSelect={(address, lat, lng, isPickup) => {
                if (isPickup) {
                  handleInputChange('pickupAddress', address);
                  handleInputChange('pickupLatitude', lat);
                  handleInputChange('pickupLongitude', lng);
                } else {
                  handleInputChange('dropoffAddress', address);
                  handleInputChange('dropoffLatitude', lat);
                  handleInputChange('dropoffLongitude', lng);
                }
              }}
            />
          )}

          <div className="flex space-x-4 mt-6">
            <button
              onClick={prevStep}
              className="px-6 py-3 border border-primary text-primary rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={nextStep}
              disabled={!bookingData.vehicleModel || !bookingData.vehicleNumberPlate}
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors"
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
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors"
            >
              {loading ? 'Creating Booking...' : 'Complete Booking'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

