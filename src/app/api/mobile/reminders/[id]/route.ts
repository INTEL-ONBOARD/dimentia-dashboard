import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Reminder from '@/models/Reminder';
import AppUser from '@/models/AppUser';
import { apiResponse, apiError, JwtPayload } from '@/lib/auth';
import { requireMobileAuth } from '@/lib/mobileAuth';
import { createNotification } from '@/lib/createNotification';

type Context = { params: Promise<{ id: string }> };

const VALID_STATUSES = ['Active', 'Inactive', 'Completed', 'Missed'];

/**
 * PUT /api/mobile/reminders/:id
 * Update a reminder's status or details.
 * Only the owner of the reminder can update it.
 *
 * Authorization: Bearer <token>
 *
 * Body (all optional):
 *   status         "Active"|"Inactive"|"Completed"|"Missed"
 *   title          string
 *   scheduledTime  ISO date string
 *   isVoice        boolean
 */
async function updateReminder(req: NextRequest, authUser: JwtPayload, context: Context): Promise<NextResponse> {
  try {
    await connectDB();
    const { id } = await context.params;

    const reminder = await Reminder.findById(id);
    if (!reminder) {
      return apiError('Reminder not found', 404);
    }

    // Ensure the authenticated user owns this reminder
    if (String(reminder.userId) !== authUser.id) {
      return apiError('Forbidden', 403);
    }

    const body = await req.json();
    const allowed = ['status', 'title', 'scheduledTime', 'isVoice'];
    const update: Record<string, unknown> = {};

    for (const key of allowed) {
      if (body[key] !== undefined) {
        if (key === 'status' && !VALID_STATUSES.includes(body[key])) {
          return apiError(`status must be one of: ${VALID_STATUSES.join(', ')}`, 400);
        }
        update[key] = key === 'scheduledTime' ? new Date(body[key]) : body[key];
      }
    }

    if (Object.keys(update).length === 0) {
      return apiError('No updatable fields provided', 400);
    }

    const updated = await Reminder.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true }
    );

    // Update user lastActive
    await AppUser.findByIdAndUpdate(authUser.id, {
      $set: { lastActive: new Date() },
    });

    if (update.status === 'Completed') {
      await createNotification(
        'Reminder Completed',
        `A user completed the reminder: "${updated?.title ?? 'Reminder'}"`,
        'success',
        '/reminders'
      );
    } else if (update.status === 'Missed') {
      await createNotification(
        'Reminder Missed',
        `A user missed the reminder: "${updated?.title ?? 'Reminder'}"`,
        'warning',
        '/reminders'
      );
    }

    return apiResponse(updated);
  } catch (error) {
    console.error('[mobile/reminders/:id PUT]', error);
    return apiError('Failed to update reminder', 500);
  }
}

/**
 * DELETE /api/mobile/reminders/:id
 * Delete a reminder. Only the owner can delete it.
 *
 * Authorization: Bearer <token>
 */
async function deleteReminder(req: NextRequest, authUser: JwtPayload, context: Context): Promise<NextResponse> {
  try {
    await connectDB();
    const { id } = await context.params;

    const reminder = await Reminder.findById(id);
    if (!reminder) {
      return apiError('Reminder not found', 404);
    }

    if (String(reminder.userId) !== authUser.id) {
      return apiError('Forbidden', 403);
    }

    await Reminder.findByIdAndDelete(id);
    return apiResponse({ deleted: true });
  } catch (error) {
    console.error('[mobile/reminders/:id DELETE]', error);
    return apiError('Failed to delete reminder', 500);
  }
}

export function PUT(req: NextRequest, context: Context) {
  return requireMobileAuth((r, u) => updateReminder(r, u, context))(req);
}

export function DELETE(req: NextRequest, context: Context) {
  return requireMobileAuth((r, u) => deleteReminder(r, u, context))(req);
}
