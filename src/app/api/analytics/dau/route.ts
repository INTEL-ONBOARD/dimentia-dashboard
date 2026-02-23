import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import AppUser from '@/models/AppUser';
import { requireAuth, apiResponse, apiError, JwtPayload } from '@/lib/auth';

async function handler(req: NextRequest, _payload: JwtPayload) {
  try {
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '7', 10);

    await connectDB();

    const results = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const dayEnd = new Date(dayStart.getTime() + 86400000);

      const count = await AppUser.countDocuments({
        lastActive: { $gte: dayStart, $lt: dayEnd },
      });

      results.push({
        date: dayStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        users: count,
      });
    }

    return apiResponse(results);
  } catch (error) {
    console.error('[GET /api/analytics/dau]', error);
    return apiError('Internal server error');
  }
}

export const GET = requireAuth(handler);
