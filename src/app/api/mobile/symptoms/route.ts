import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SymptomLog from '@/models/SymptomLog';
import AppUser from '@/models/AppUser';
import ActivityLog from '@/models/ActivityLog';
import { apiResponse, apiError, JwtPayload } from '@/lib/auth';
import { requireMobileAuth } from '@/lib/mobileAuth';
import { createNotification } from '@/lib/createNotification';

/**
 * POST /api/mobile/symptoms
 * Log a symptom entry for the authenticated user.
 *
 * Authorization: Bearer <token>
 *
 * Body:
 *   symptoms   string[]  required  e.g. ["headache","fatigue"]
 *   notes      string    optional
 *   loggedAt   ISO date  optional  (defaults to now)
 */
async function logSymptom(req: NextRequest, authUser: JwtPayload): Promise<NextResponse> {
  try {
    await connectDB();

    const body = await req.json();
    const { symptoms, notes, loggedAt } = body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return apiError('symptoms must be a non-empty array of strings', 400);
    }

    const entry = await SymptomLog.create({
      userId: authUser.id,
      symptoms,
      notes: notes ?? undefined,
      loggedAt: loggedAt ? new Date(loggedAt) : new Date(),
    });

    // Award 5 points for logging symptoms
    await AppUser.findByIdAndUpdate(authUser.id, {
      $inc: { totalPoints: 5 },
      $set: { lastActive: new Date(), status: 'Active' },
    });

    // Write to activity feed
    await ActivityLog.create({
      action: `Logged symptoms: ${symptoms.join(', ')}`,
      userName: authUser.email,
      userId: authUser.id,
      type: 'symptom_logged',
    });

    await createNotification(
      'Symptoms Logged',
      `A user logged ${symptoms.length} symptom(s): ${symptoms.slice(0, 2).join(', ')}${symptoms.length > 2 ? '...' : ''}`,
      'info',
      '/health-insights'
    );

    return apiResponse({ logId: entry._id, pointsEarned: 5 }, 201);
  } catch (error) {
    console.error('[mobile/symptoms POST]', error);
    return apiError('Failed to log symptom', 500);
  }
}

/**
 * GET /api/mobile/symptoms
 * Retrieve the authenticated user's symptom history.
 *
 * Query params:
 *   limit   number  default 20
 *   page    number  default 1
 */
async function getSymptoms(req: NextRequest, authUser: JwtPayload): Promise<NextResponse> {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get('limit') ?? 20), 100);
    const page = Math.max(Number(searchParams.get('page') ?? 1), 1);
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      SymptomLog.find({ userId: authUser.id })
        .sort({ loggedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      SymptomLog.countDocuments({ userId: authUser.id }),
    ]);

    return apiResponse({ logs, total, page, limit });
  } catch (error) {
    console.error('[mobile/symptoms GET]', error);
    return apiError('Failed to fetch symptoms', 500);
  }
}

export const POST = requireMobileAuth(logSymptom);
export const GET = requireMobileAuth(getSymptoms);
