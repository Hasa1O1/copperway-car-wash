import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { generateToken } from '@/lib/auth';
import { ApiResponse, LoginRequest, LoginResponse } from '@/types';

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<LoginResponse>>> {
  try {
    const body: LoginRequest = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Username and password are required',
        },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.adminUser.findUnique({
      where: { username },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid credentials',
        },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid credentials',
        },
        { status: 401 }
      );
    }

    // Update last login
    await prisma.adminUser.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Generate token
    const token = generateToken(user);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      data: {
        token,
        user: userWithoutPassword,
      },
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Login failed',
      },
      { status: 500 }
    );
  }
}
