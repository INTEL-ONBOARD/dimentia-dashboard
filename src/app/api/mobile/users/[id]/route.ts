import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import AppUser from '@/models/AppUser';
import { apiResponse, apiError } from '@/lib/auth';
import { requireMobileAuth } from '@/lib/mobileAuth';
import type { JwtPayload } from '@/lib/auth';

type Context = { params: Promise<{ id: string }> };

/**
 * PUT /api/mobile/users/:id
 * Update the authenticated user's profile.
 * Only the token owner can update their own record.
 *
 * Authorization: Bearer <token>
 *
 * Body (all optional):
 *   fullName     string
 *   age          number
 *   gender       "Male" | "Female" | "Other"
 *   status       "Active" | "Inactive"
 *   lastActive   ISO date string  (mobile sends on each app open)
 */
async function updateUser(req: NextRequest, authUser: JwtPayload, context: Context): Promise<NextResponse> {
  try {
    await connectDB();
    const { id } = await context.params;

    // Users can only update their own profile
    if (id !== authUser.id) {
      return apiError('Forbidden', 403);
    }

    const body = await req.json();
    const allowed = ['fullName', 'age', 'gender', 'status', 'lastActive'];
    const update: Record<string, unknown> = {};

    for (const key of allowed) {
      if (body[key] !== undefined) {
        update[key] = body[key];
      }
    }

    if (Object.keys(update).length === 0) {
      return apiError('No updatable fields provided', 400);
    }

    const user = await AppUser.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, select: '-passwordHash' }
    );

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
      lastActive: user.lastActive,
    });
  } catch (error) {
    console.error('[mobile/users/:id PUT]', error);
    return apiError('Failed to update user', 500);
  }
}

export function PUT(req: NextRequest, context: Context) {
  return requireMobileAuth((r, u) => updateUser(r, u, context))(req);
}
