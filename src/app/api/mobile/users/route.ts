import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AppUser from '@/models/AppUser';
import { requireMobileAuth } from '@/lib/mobileAuth';
import { apiResponse, apiError, JwtPayload } from '@/lib/auth';

/**
 * GET /api/mobile/users/me  →  use the [id] route with "me" or use the profile from auth token.
 *
 * GET /api/mobile/users
 * Returns the currently authenticated user's profile.
 * Authorization: Bearer <token>
 */
async function getProfile(req: NextRequest, authUser: JwtPayload): Promise<NextResponse> {
  try {
    await connectDB();

    const user = await AppUser.findById(authUser.id).select('-passwordHash');
    if (!user) {
      return apiError('User not found', 404);
    }

    return apiResponse({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      age: user.age,
      gender: user.gender,
      totalPoints: user.totalPoints,
      totalSessions: user.totalSessions,
      status: user.status,
      registeredDate: user.registeredDate,
      lastActive: user.lastActive,
    });
  } catch (error) {
    console.error('[mobile/users GET]', error);
    return apiError('Failed to fetch profile', 500);
  }
}

export const GET = requireMobileAuth(getProfile);
