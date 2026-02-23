import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest, apiError, JwtPayload } from '@/lib/auth';

/**
 * Mobile-specific auth guard.
 * Verifies the Bearer JWT sent by the mobile app.
 * The token payload contains { id, email, role } of the AppUser.
 */
export function requireMobileAuth(
  handler: (req: NextRequest, user: JwtPayload) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: unknown): Promise<NextResponse> => {
    const token = getTokenFromRequest(req);

    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
      const payload = verifyToken(token);
      return handler(req, payload);
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 401 });
    }
  };
}
