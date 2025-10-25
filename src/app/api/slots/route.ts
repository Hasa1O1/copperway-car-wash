import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ApiResponse, TimeSlot } from '@/types';
import { getAvailableTimeSlots } from '@/lib/utils';

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<TimeSlot[]>>> {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const serviceId = searchParams.get('serviceId');

    if (!date || !serviceId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Date and serviceId are required',
        },
        { status: 400 }
      );
    }

    const bookingDate = new Date(date);
    const service = await prisma.service.findUnique({
      where: { id: parseInt(serviceId) },
    });

    if (!service) {
      return NextResponse.json(
        {
          success: false,
          error: 'Service not found',
        },
        { status: 404 }
      );
    }

    // Get business hours
    const businessHours = await prisma.businessHours.findMany();

    // Get existing bookings for the date
    const existingBookings = await prisma.booking.findMany({
      where: {
        scheduledDate: bookingDate,
        status: {
          not: 'CANCELLED',
        },
      },
      include: {
        service: true,
      },
    });

    const availableSlots = getAvailableTimeSlots(
      bookingDate,
      businessHours,
      existingBookings,
      service.duration
    );

    const timeSlots: TimeSlot[] = availableSlots.map(time => ({
      time,
      available: true,
    }));

    return NextResponse.json({
      success: true,
      data: timeSlots,
    });
  } catch (error) {
    console.error('Error fetching time slots:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch time slots',
      },
      { status: 500 }
    );
  }
}
