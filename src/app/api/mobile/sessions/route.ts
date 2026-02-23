import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Session from '@/models/Session';
import AppUser from '@/models/AppUser';
import ActivityLog from '@/models/ActivityLog';
import { apiResponse, apiError, JwtPayload } from '@/lib/auth';
import { requireMobileAuth } from '@/lib/mobileAuth';

/**
 * POST /api/mobile/sessions
 * Log a completed app session for the authenticated user.
 * Call this when the user closes / backgrounds the app.
 *
 * Authorization: Bearer <token>
 *
 * Body:
 *   startedAt        ISO date string  required
 *   endedAt          ISO date string  required
 *   durationSeconds  number           required
 *   featuresUsed     string[]         optional  e.g. ["reminders","articles","mood"]
 */
async function createSession(req: NextRequest, authUser: JwtPayload): Promise<NextResponse> {
  try {
    await connectDB();

    const body = await req.json();
    const { startedAt, endedAt, durationSeconds, featuresUsed } = body;

    if (!startedAt || !endedAt || durationSeconds === undefined) {
      return apiError('startedAt, endedAt, and durationSeconds are required', 400);
    }

    const session = await Session.create({
      userId: authUser.id,
      startedAt: new Date(startedAt),
      endedAt: new Date(endedAt),
      durationSeconds: Number(durationSeconds),
      featuresUsed: Array.isArray(featuresUsed) ? featuresUsed : [],
    });

    // Increment user session count and update lastActive
    await AppUser.findByIdAndUpdate(authUser.id, {
      $inc: { totalSessions: 1 },
      $set: { lastActive: new Date(endedAt), status: 'Active' },
    });

    // Write to activity feed
    await ActivityLog.create({
      action: 'Started an app session',
      userName: authUser.email,
      userId: authUser.id,
      type: 'session_started',
    });

    return apiResponse({ sessionId: session._id }, 201);
  } catch (error) {
    console.error('[mobile/sessions POST]', error);
    return apiError('Failed to log session', 500);
  }
}

export const POST = requireMobileAuth(createSession);
