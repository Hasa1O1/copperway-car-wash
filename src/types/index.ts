export interface Service {
  id: number;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: number;
  bookingNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  vehicleModel: string;
  vehicleNumberPlate: string;
  serviceId: number;
  scheduledDate: Date;
  scheduledTime: Date;
  pickupRequired: boolean;
  pickupAddress: string | null;
  dropoffAddress: string | null;
  status: BookingStatus;
  amount: number;
  paymentConfirmed: boolean;
  paymentMethod: string | null;
  paymentScreenshot: string | null;
  paymentNotes: string | null;
  slotNumber: number | null;
  estimatedCompletionTime: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  service?: Service;
}

export interface AdminUser {
  id: number;
  username: string;
  fullName: string;
  email: string | null;
  role: UserRole;
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BusinessHours {
  id: number;
  dayOfWeek: number;
  openTime: Date;
  closeTime: Date;
  isOpen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LocationSettings {
  id: number;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  email: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum BookingStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PAYMENT_VERIFIED = 'PAYMENT_VERIFIED',
  CONFIRMED = 'CONFIRMED',
  IN_QUEUE = 'IN_QUEUE',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  CUSTOMER_SERVICE = 'CUSTOMER_SERVICE',
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

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
  dropoffAddress?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AdminUser;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface QueueItem {
  booking: Booking;
  position: number;
  estimatedStartTime: Date;
}
