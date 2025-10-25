import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ApiResponse, Booking } from '@/types';

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<Booking>>> {
  try {
    const { searchParams } = new URL(request.url);
    const bookingNumber = searchParams.get('bookingNumber');
    const phone = searchParams.get('phone');

    if (!bookingNumber && !phone) {
      return NextResponse.json(
        {
          success: false,
          error: 'Booking number or phone number is required',
        },
        { status: 400 }
      );
    }

    let booking: Booking | null = null;

    if (bookingNumber) {
      booking = await prisma.booking.findUnique({
        where: { bookingNumber },
        include: {
          service: true,
        },
      });
    } else if (phone) {
      // Find the most recent booking for this phone number
      booking = await prisma.booking.findFirst({
        where: { customerPhone: phone },
        orderBy: { createdAt: 'desc' },
        include: {
          service: true,
        },
      });
    }

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          error: 'Booking not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch booking',
      },
      { status: 500 }
    );
  }
}
