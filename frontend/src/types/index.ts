export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  is_active: boolean;
}

export interface Booking {
  id: number;
  booking_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  vehicle_model: string;
  vehicle_number_plate: string;
  service_id: number;
  service?: Service;
  scheduled_date: string;
  scheduled_time: string;
  pickup_required: boolean;
  pickup_address?: string;
  pickup_latitude?: number;
  pickup_longitude?: number;
  dropoff_address?: string;
  dropoff_latitude?: number;
  dropoff_longitude?: number;
  status: BookingStatus;
  amount: number;
  payment_confirmed: boolean;
  payment_method?: string;
  slot_number?: number;
  estimated_completion_time?: string;
  created_at: string;
}

export type BookingStatus = 
  | 'pending_payment'
  | 'payment_verified'
  | 'confirmed'
  | 'in_queue'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface CreateBookingRequest {
  serviceId: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  vehicleModel: string;
  vehicleNumberPlate: string;
  scheduledDate: string;
  scheduledTime: string;
  pickupRequired: boolean;
  pickupAddress?: string;
  pickupLatitude?: number;
  pickupLongitude?: number;
  dropoffAddress?: string;
  dropoffLatitude?: number;
  dropoffLongitude?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

