import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ApiResponse, CreateBookingRequest, Booking } from '@/types';
import { generateBookingNumber, sanitizeInput, isValidEmail } from '@/lib/utils';

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Booking>>> {
  try {
    const body: CreateBookingRequest = await request.json();

    // Validate required fields
    const {
      serviceId,
      customerName,
      customerPhone,
      customerEmail,
      vehicleModel,
      vehicleNumberPlate,
      scheduledDate,
      scheduledTime,
      pickupRequired,
      pickupAddress,
      dropoffAddress,
    } = body;

    if (!serviceId || !customerName || !customerPhone || !vehicleModel || !vehicleNumberPlate || !scheduledDate || !scheduledTime) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    // Validate email if provided
    if (customerEmail && !isValidEmail(customerEmail)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email format',
        },
        { status: 400 }
      );
    }

    // Get service details
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
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

    // Generate unique booking number
    let bookingNumber: string;
    let isUnique = false;
    let attempts = 0;

    do {
      bookingNumber = generateBookingNumber();
      const existingBooking = await prisma.booking.findUnique({
        where: { bookingNumber },
      });
      isUnique = !existingBooking;
      attempts++;
    } while (!isUnique && attempts < 10);

    if (!isUnique) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to generate unique booking number',
        },
        { status: 500 }
      );
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        bookingNumber,
        customerName: sanitizeInput(customerName),
        customerPhone: sanitizeInput(customerPhone),
        customerEmail: customerEmail ? sanitizeInput(customerEmail) : null,
        vehicleModel: sanitizeInput(vehicleModel),
        vehicleNumberPlate: sanitizeInput(vehicleNumberPlate),
        serviceId,
        scheduledDate: new Date(scheduledDate),
        scheduledTime: new Date(`1970-01-01T${scheduledTime}:00Z`),
        pickupRequired,
        pickupAddress: pickupAddress ? sanitizeInput(pickupAddress) : null,
        dropoffAddress: dropoffAddress ? sanitizeInput(dropoffAddress) : null,
        amount: service.price,
        status: 'PENDING_PAYMENT',
      },
      include: {
        service: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: booking,
      message: 'Booking created successfully',
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create booking',
      },
      { status: 500 }
    );
  }
}
