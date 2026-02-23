import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ActivityLog from '@/models/ActivityLog';
import AppUser from '@/models/AppUser';
import { apiResponse, apiError, JwtPayload } from '@/lib/auth';
import { requireMobileAuth } from '@/lib/mobileAuth';
import { createNotification } from '@/lib/createNotification';

const VALID_TYPES = [
  'user_registered',
  'article_completed',
  'symptom_logged',
  'reminder_created',
  'exercise_completed',
  'mood_logged',
  'session_started',
];

/**
 * POST /api/mobile/activity
 * Log a custom activity event for the authenticated user.
 * Most events are logged automatically by other endpoints;
 * use this for any additional events (e.g. exercise_completed).
 *
 * Authorization: Bearer <token>
 *
 * Body:
 *   action  string  required  — human-readable description, e.g. "Completed 10-min walk exercise"
 *   type    ActivityType  required — must be one of the enum values
 */
async function logActivity(req: NextRequest, authUser: JwtPayload): Promise<NextResponse> {
  try {
    await connectDB();

    const body = await req.json();
    const { action, type } = body;

    if (!action || !type) {
      return apiError('action and type are required', 400);
    }

    if (!VALID_TYPES.includes(type)) {
      return apiError(`type must be one of: ${VALID_TYPES.join(', ')}`, 400);
    }

    // Fetch user name for the activity feed
    const user = await AppUser.findById(authUser.id).select('fullName').lean();
    const userName = (user as { fullName?: string } | null)?.fullName ?? authUser.email;

    const entry = await ActivityLog.create({
      action,
      userName,
      userId: authUser.id,
      type,
    });

    // Award 5 points for exercise completion
    if (type === 'exercise_completed') {
      await AppUser.findByIdAndUpdate(authUser.id, {
        $inc: { totalPoints: 5 },
        $set: { lastActive: new Date(), status: 'Active' },
      });
      await createNotification(
        'Exercise Completed',
        `${userName} completed an exercise: "${action}" (+5 points)`,
        'success',
        '/engagement'
      );
    }

    return apiResponse({ activityId: entry._id }, 201);
  } catch (error) {
    console.error('[mobile/activity POST]', error);
    return apiError('Failed to log activity', 500);
  }
}

export const POST = requireMobileAuth(logActivity);
