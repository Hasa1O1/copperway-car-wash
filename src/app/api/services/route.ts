import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ApiResponse, Service } from '@/types';

export async function GET(): Promise<NextResponse<ApiResponse<Service[]>>> {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch services',
      },
      { status: 500 }
    );
  }
}
