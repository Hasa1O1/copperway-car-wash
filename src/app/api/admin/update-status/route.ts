import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { ApiResponse, Booking, BookingStatus } from '@/types';

async function handler(request: NextRequest): Promise<NextResponse<ApiResponse<Booking>>> {
  try {
    const body = await request.json();
    const { bookingId, status, notes } = body;

    if (!bookingId || !status) {
      return NextResponse.json(
        {
          success: false,
          error: 'Booking ID and status are required',
        },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses: BookingStatus[] = [
      'PENDING_PAYMENT',
      'PAYMENT_VERIFIED',
      'CONFIRMED',
      'IN_QUEUE',
      'IN_PROGRESS',
      'COMPLETED',
      'CANCELLED',
    ];

    if (!validStatuses.includes(status as BookingStatus)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid status',
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

    // Update booking status
    const updateData: any = {
      status: status as BookingStatus,
    };

    // Set completion time if status is completed
    if (status === 'COMPLETED') {
      updateData.completedAt = new Date();
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: updateData,
      include: { service: true },
    });

    // Create queue history entry
    await prisma.queueHistory.create({
      data: {
        bookingId: booking.id,
        statusChange: status as BookingStatus,
        changedBy: (request as any).user.id,
        notes: notes || `Status changed to ${status}`,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedBooking,
      message: 'Booking status updated successfully',
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update booking status',
      },
      { status: 500 }
    );
  }
}

export const POST = requireAuth(handler);
