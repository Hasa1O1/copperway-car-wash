import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { ApiResponse, QueueItem } from '@/types';

async function handler(request: NextRequest): Promise<NextResponse<ApiResponse<QueueItem[]>>> {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        {
          success: false,
          error: 'Date is required',
        },
        { status: 400 }
      );
    }

    const queueDate = new Date(date);

    // Get bookings for the specified date that are in queue or in progress
    const bookings = await prisma.booking.findMany({
      where: {
        scheduledDate: queueDate,
        status: { in: ['CONFIRMED', 'IN_QUEUE', 'IN_PROGRESS'] },
      },
      include: {
        service: true,
      },
      orderBy: [
        { slotNumber: 'asc' },
        { scheduledTime: 'asc' },
      ],
    });

    const queueItems: QueueItem[] = bookings.map((booking, index) => ({
      booking,
      position: index + 1,
      estimatedStartTime: booking.estimatedCompletionTime || new Date(),
    }));

    return NextResponse.json({
      success: true,
      data: queueItems,
    });
  } catch (error) {
    console.error('Error fetching queue:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch queue',
      },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handler);
