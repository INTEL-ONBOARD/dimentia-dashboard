import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Session from '@/models/Session';
import { requireAuth, apiResponse, apiError, JwtPayload } from '@/lib/auth';

const FEATURE_COLORS: Record<string, string> = {
  Articles: '#7C3AED',
  Symptoms: '#8B5CF6',
  Mood: '#A78BFA',
  Breathing: '#C4B5FD',
  Reminders: '#DDD6FE',
};

async function handler(_req: NextRequest, _payload: JwtPayload) {
  try {
    await connectDB();

    const result = await Session.aggregate([
      { $unwind: '$featuresUsed' },
      { $group: { _id: '$featuresUsed', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const total = result.reduce((sum, r) => sum + r.count, 0);

    const featureUsage = result.map((r) => ({
      name: r._id,
      value: total > 0 ? Math.round((r.count / total) * 100) : 0,
      color: FEATURE_COLORS[r._id] || '#7C3AED',
    }));

    return apiResponse(featureUsage);
  } catch (error) {
    console.error('[GET /api/analytics/feature-usage]', error);
    return apiError('Internal server error');
  }
}

export const GET = requireAuth(handler);
