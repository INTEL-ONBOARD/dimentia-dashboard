import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import ActivityLog from '@/models/ActivityLog';
import { requireAuth, apiResponse, apiError, JwtPayload } from '@/lib/auth';

async function handler(req: NextRequest, _payload: JwtPayload) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '10', 10));

    await connectDB();

    const activities = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(limit);

    const now = new Date();

    const formatted = activities.map((a) => {
      const diffMs = now.getTime() - new Date(a.createdAt).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      let timeAgo: string;
      if (diffMins < 1) timeAgo = 'just now';
      else if (diffMins < 60) timeAgo = `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
      else if (diffHours < 24) timeAgo = `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
      else timeAgo = `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;

      return {
        id: a._id.toString(),
        action: a.action,
        user: a.userName,
        time: timeAgo,
        type: a.type,
      };
    });

    return apiResponse(formatted);
  } catch (error) {
    console.error('[GET /api/activity]', error);
    return apiError('Internal server error');
  }
}

export const GET = requireAuth(handler);
