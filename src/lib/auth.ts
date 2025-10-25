import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { AdminUser, UserRole } from '@/types';

export interface AuthenticatedRequest extends NextRequest {
  user?: AdminUser;
}

export function generateToken(user: AdminUser): string {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      role: user.role 
    },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    return null;
  }
}

export function authenticateToken(request: NextRequest): AdminUser | null {
  const authHeader = request.headers.get('authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return null;
  }

  const decoded = verifyToken(token);
  return decoded ? decoded : null;
}

export function requireAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const user = authenticateToken(req);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    (req as AuthenticatedRequest).user = user;
    return handler(req as AuthenticatedRequest);
  };
}

export function requireRole(roles: UserRole[]) {
  return function(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
    return async (req: NextRequest) => {
      const user = authenticateToken(req);
      
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Authentication required' },
          { status: 401 }
        );
      }

      if (!roles.includes(user.role)) {
        return NextResponse.json(
          { success: false, error: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      (req as AuthenticatedRequest).user = user;
      return handler(req as AuthenticatedRequest);
    };
  };
}
