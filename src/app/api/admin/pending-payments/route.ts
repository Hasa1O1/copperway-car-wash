import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { ApiResponse, Booking } from '@/types';

async function handler(request: NextRequest): Promise<NextResponse<ApiResponse<Booking[]>>> {
  try {
    const pendingBookings = await prisma.booking.findMany({
      where: {
        status: 'PENDING_PAYMENT',
      },
      include: {
        service: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: pendingBookings,
    });
  } catch (error) {
    console.error('Error fetching pending payments:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch pending payments',
      },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handler);
