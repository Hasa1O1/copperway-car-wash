import { format, addMinutes, isWithinInterval, parseISO } from 'date-fns';
import { BookingStatus } from '@/types';

export function generateBookingNumber(): string {
  const prefix = 'CW';
  const date = format(new Date(), 'yyyyMMdd');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}${date}${random}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatTime(date: Date): string {
  return format(date, 'HH:mm');
}

export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function formatDateTime(date: Date): string {
  return format(date, 'yyyy-MM-dd HH:mm');
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export function calculateEstimatedCompletionTime(
  scheduledTime: Date,
  serviceDuration: number,
  queuePosition: number
): Date {
  const baseTime = new Date(scheduledTime);
  const queueDelay = queuePosition * serviceDuration;
  return addMinutes(baseTime, queueDelay);
}

export function isBusinessHours(date: Date, businessHours: any[]): boolean {
  const dayOfWeek = date.getDay();
  const time = format(date, 'HH:mm');
  
  const dayHours = businessHours.find(h => h.dayOfWeek === dayOfWeek);
  
  if (!dayHours || !dayHours.isOpen) {
    return false;
  }
  
  const openTime = format(dayHours.openTime, 'HH:mm');
  const closeTime = format(dayHours.closeTime, 'HH:mm');
  
  return time >= openTime && time <= closeTime;
}

export function getAvailableTimeSlots(
  date: Date,
  businessHours: any[],
  existingBookings: any[],
  serviceDuration: number = 30
): string[] {
  const slots: string[] = [];
  const dayOfWeek = date.getDay();
  const dayHours = businessHours.find(h => h.dayOfWeek === dayOfWeek);
  
  if (!dayHours || !dayHours.isOpen) {
    return slots;
  }
  
  const openTime = new Date(dayHours.openTime);
  const closeTime = new Date(dayHours.closeTime);
  const currentTime = new Date();
  
  // Start from current time if booking for today, otherwise start from opening time
  const startTime = date.toDateString() === currentTime.toDateString() 
    ? new Date(Math.max(openTime.getTime(), currentTime.getTime() + 30 * 60 * 1000)) // 30 min buffer
    : openTime;
  
  const endTime = closeTime;
  
  // Generate 30-minute slots
  for (let time = new Date(startTime); time < endTime; time = addMinutes(time, 30)) {
    const slotEndTime = addMinutes(time, serviceDuration);
    
    if (slotEndTime <= endTime) {
      // Check if slot conflicts with existing bookings
      const hasConflict = existingBookings.some(booking => {
        // Extract just the time portion from the scheduled time
        const bookingTime = new Date(booking.scheduledTime);
        const bookingHours = bookingTime.getHours();
        const bookingMinutes = bookingTime.getMinutes();
        
        // Create a proper Date object for comparison using the same date as the booking
        const bookingStart = new Date(booking.scheduledDate);
        bookingStart.setHours(bookingHours, bookingMinutes, 0, 0);
        
        const bookingEnd = addMinutes(bookingStart, booking.service.duration);
        
        return isWithinInterval(time, { start: bookingStart, end: bookingEnd }) ||
               isWithinInterval(slotEndTime, { start: bookingStart, end: bookingEnd });
      });
      
      if (!hasConflict) {
        slots.push(format(time, 'HH:mm'));
      }
    }
  }
  
  return slots;
}

export function getBookingStatusColor(status: BookingStatus): string {
  switch (status) {
    case BookingStatus.PENDING_PAYMENT:
      return 'bg-yellow-100 text-yellow-800';
    case BookingStatus.PAYMENT_VERIFIED:
      return 'bg-blue-100 text-blue-800';
    case BookingStatus.CONFIRMED:
      return 'bg-green-100 text-green-800';
    case BookingStatus.IN_QUEUE:
      return 'bg-purple-100 text-purple-800';
    case BookingStatus.IN_PROGRESS:
      return 'bg-orange-100 text-orange-800';
    case BookingStatus.COMPLETED:
      return 'bg-gray-100 text-gray-800';
    case BookingStatus.CANCELLED:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getBookingStatusText(status: BookingStatus): string {
  switch (status) {
    case BookingStatus.PENDING_PAYMENT:
      return 'Pending Payment';
    case BookingStatus.PAYMENT_VERIFIED:
      return 'Payment Verified';
    case BookingStatus.CONFIRMED:
      return 'Confirmed';
    case BookingStatus.IN_QUEUE:
      return 'In Queue';
    case BookingStatus.IN_PROGRESS:
      return 'In Progress';
    case BookingStatus.COMPLETED:
      return 'Completed';
    case BookingStatus.CANCELLED:
      return 'Cancelled';
    default:
      return 'Unknown';
  }
}
