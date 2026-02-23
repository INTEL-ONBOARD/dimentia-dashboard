import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Reminder from '@/models/Reminder';
import ActivityLog from '@/models/ActivityLog';
import AppUser from '@/models/AppUser';
import { apiResponse, apiError, JwtPayload } from '@/lib/auth';
import { requireMobileAuth } from '@/lib/mobileAuth';
import { createNotification } from '@/lib/createNotification';

const VALID_TYPES = ['medication', 'voice', 'appointment', 'other'];

/**
 * POST /api/mobile/reminders
 * Create a new reminder for the authenticated user.
 *
 * Authorization: Bearer <token>
 *
 * Body:
 *   title          string   required
 *   scheduledTime  ISO date required
 *   type           "medication"|"voice"|"appointment"|"other"  optional (default "other")
 *   isVoice        boolean  optional (default false)
 */
async function createReminder(req: NextRequest, authUser: JwtPayload): Promise<NextResponse> {
  try {
    await connectDB();

    const body = await req.json();
    const { title, scheduledTime, type, isVoice } = body;

    if (!title || !scheduledTime) {
      return apiError('title and scheduledTime are required', 400);
    }

    if (type && !VALID_TYPES.includes(type)) {
      return apiError(`type must be one of: ${VALID_TYPES.join(', ')}`, 400);
    }

    const reminder = await Reminder.create({
      userId: authUser.id,
      title,
      scheduledTime: new Date(scheduledTime),
      type: type ?? 'other',
      isVoice: isVoice ?? false,
      status: 'Active',
    });

    // Update lastActive
    await AppUser.findByIdAndUpdate(authUser.id, {
      $set: { lastActive: new Date(), status: 'Active' },
    });

    // Write to activity feed
    await ActivityLog.create({
      action: `Created reminder: ${title}`,
      userName: authUser.email,
      userId: authUser.id,
      type: 'reminder_created',
    });

    await createNotification(
      'Reminder Created',
      `A user created a ${type ?? 'other'} reminder: "${title}"`,
      'info',
      '/reminders'
    );

    return apiResponse({ reminderId: reminder._id }, 201);
  } catch (error) {
    console.error('[mobile/reminders POST]', error);
    return apiError('Failed to create reminder', 500);
  }
}

/**
 * GET /api/mobile/reminders
 * List reminders for the authenticated user.
 *
 * Query params:
 *   status  "Active"|"Completed"|"Missed"|"Inactive"  optional filter
 *   limit   number  default 50
 */
async function getReminders(req: NextRequest, authUser: JwtPayload): Promise<NextResponse> {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limit = Math.min(Number(searchParams.get('limit') ?? 50), 200);

    const query: Record<string, unknown> = { userId: authUser.id };
    if (status) query.status = status;

    const reminders = await Reminder.find(query)
      .sort({ scheduledTime: 1 })
      .limit(limit)
      .lean();

    return apiResponse({ reminders });
  } catch (error) {
    console.error('[mobile/reminders GET]', error);
    return apiError('Failed to fetch reminders', 500);
  }
}

export const POST = requireMobileAuth(createReminder);
export const GET = requireMobileAuth(getReminders);
