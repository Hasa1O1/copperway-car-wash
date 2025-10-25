import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { ApiResponse, Booking } from '@/types';
import { calculateEstimatedCompletionTime } from '@/lib/utils';

async function handler(request: NextRequest): Promise<NextResponse<ApiResponse<Booking>>> {
  try {
    const body = await request.json();
    const { bookingId, verified, notes } = body;

    if (!bookingId || typeof verified !== 'boolean') {
      return NextResponse.json(
        {
          success: false,
          error: 'Booking ID and verification status are required',
        },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(bookingId) },
      include: { service: true },
    });

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          error: 'Booking not found',
        },
        { status: 404 }
      );
    }

    if (booking.status !== 'PENDING_PAYMENT') {
      return NextResponse.json(
        {
          success: false,
          error: 'Booking is not in pending payment status',
        },
        { status: 400 }
      );
    }

    let updatedBooking: Booking;

    if (verified) {
      // Get queue position for slot assignment
      const queueCount = await prisma.booking.count({
        where: {
          scheduledDate: booking.scheduledDate,
          status: { in: ['CONFIRMED', 'IN_QUEUE', 'IN_PROGRESS'] },
        },
      });

      const slotNumber = queueCount + 1;
      const estimatedCompletionTime = calculateEstimatedCompletionTime(
        new Date(booking.scheduledTime),
        booking.service.duration,
        queueCount
      );

      updatedBooking = await prisma.booking.update({
        where: { id: booking.id },
        data: {
          status: 'PAYMENT_VERIFIED',
          paymentConfirmed: true,
          paymentNotes: notes || null,
          slotNumber,
          estimatedCompletionTime,
        },
        include: { service: true },
      });

      // Create queue history entry
      await prisma.queueHistory.create({
        data: {
          bookingId: booking.id,
          statusChange: 'PAYMENT_VERIFIED',
          changedBy: (request as any).user.id,
          notes: notes || 'Payment verified',
        },
      });
    } else {
      updatedBooking = await prisma.booking.update({
        where: { id: booking.id },
        data: {
          paymentNotes: notes || null,
        },
        include: { service: true },
      });
    }

    return NextResponse.json({
      success: true,
      data: updatedBooking,
      message: verified ? 'Payment verified successfully' : 'Payment verification updated',
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to verify payment',
      },
      { status: 500 }
    );
  }
}

export const POST = requireAuth(handler);
