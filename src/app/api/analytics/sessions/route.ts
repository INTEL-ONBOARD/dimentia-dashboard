import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Session from '@/models/Session';
import { requireAuth, apiResponse, apiError, JwtPayload } from '@/lib/auth';

async function handler(_req: NextRequest, _payload: JwtPayload) {
  try {
    await connectDB();

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [thisMonthSessions, lastMonthSessions, durationAgg] = await Promise.all([
      Session.countDocuments({ createdAt: { $gte: monthStart } }),
      Session.countDocuments({ createdAt: { $gte: prevMonthStart, $lt: monthStart } }),
      Session.aggregate([
        { $group: { _id: null, avgDuration: { $avg: '$durationSeconds' } } },
      ]),
    ]);

    const viewsChange =
      lastMonthSessions > 0
        ? (((thisMonthSessions - lastMonthSessions) / lastMonthSessions) * 100).toFixed(1)
        : 0;

    const avgDurationSeconds = durationAgg[0]?.avgDuration || 0;
    const avgSessionDurationMinutes = parseFloat((avgDurationSeconds / 60).toFixed(1));

    return apiResponse({
      totalViews: thisMonthSessions,
      viewsChange: Number(viewsChange),
      avgSessionDuration: avgSessionDurationMinutes,
      durationChange: 0, // Requires historic comparison — can extend later
    });
  } catch (error) {
    console.error('[GET /api/analytics/sessions]', error);
    return apiError('Internal server error');
  }
}

export const GET = requireAuth(handler);
