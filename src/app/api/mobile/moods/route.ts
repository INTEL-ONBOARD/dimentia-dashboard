import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import MoodLog from '@/models/MoodLog';
import AppUser from '@/models/AppUser';
import ActivityLog from '@/models/ActivityLog';
import { apiResponse, apiError, JwtPayload } from '@/lib/auth';
import { requireMobileAuth } from '@/lib/mobileAuth';
import { createNotification } from '@/lib/createNotification';

const VALID_MOODS = ['Happy', 'Calm', 'Okay', 'Tired', 'Anxious', 'Sad', 'Irritable', 'Upset'];

/**
 * POST /api/mobile/moods
 * Log a mood entry for the authenticated user.
 *
 * Authorization: Bearer <token>
 *
 * Body:
 *   mood      "Happy"|"Calm"|"Okay"|"Tired"|"Anxious"|"Sad"|"Irritable"|"Upset"  required
 *   notes     string    optional
 *   loggedAt  ISO date  optional  (defaults to now)
 */
async function logMood(req: NextRequest, authUser: JwtPayload): Promise<NextResponse> {
  try {
    await connectDB();

    const body = await req.json();
    const { mood, notes, loggedAt } = body;

    if (!mood || !VALID_MOODS.includes(mood)) {
      return apiError(`mood must be one of: ${VALID_MOODS.join(', ')}`, 400);
    }

    const entry = await MoodLog.create({
      userId: authUser.id,
      mood,
      notes: notes ?? undefined,
      loggedAt: loggedAt ? new Date(loggedAt) : new Date(),
    });

    // Award 5 points for logging mood
    await AppUser.findByIdAndUpdate(authUser.id, {
      $inc: { totalPoints: 5 },
      $set: { lastActive: new Date(), status: 'Active' },
    });

    // Write to activity feed
    await ActivityLog.create({
      action: `Logged mood: ${mood}`,
      userName: authUser.email,
      userId: authUser.id,
      type: 'mood_logged',
    });

    await createNotification(
      'Mood Logged',
      `A user reported feeling ${mood}`,
      'info',
      '/health-insights'
    );

    return apiResponse({ logId: entry._id, pointsEarned: 5 }, 201);
  } catch (error) {
    console.error('[mobile/moods POST]', error);
    return apiError('Failed to log mood', 500);
  }
}

/**
 * GET /api/mobile/moods
 * Retrieve the authenticated user's mood history.
 *
 * Query params:
 *   limit  number  default 20
 *   page   number  default 1
 */
async function getMoods(req: NextRequest, authUser: JwtPayload): Promise<NextResponse> {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get('limit') ?? 20), 100);
    const page = Math.max(Number(searchParams.get('page') ?? 1), 1);
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      MoodLog.find({ userId: authUser.id })
        .sort({ loggedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      MoodLog.countDocuments({ userId: authUser.id }),
    ]);

    return apiResponse({ logs, total, page, limit });
  } catch (error) {
    console.error('[mobile/moods GET]', error);
    return apiError('Failed to fetch moods', 500);
  }
}

export const POST = requireMobileAuth(logMood);
export const GET = requireMobileAuth(getMoods);
