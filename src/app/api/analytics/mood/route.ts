import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import MoodLog from '@/models/MoodLog';
import { requireAuth, apiResponse, apiError, JwtPayload } from '@/lib/auth';

const MOOD_COLORS: Record<string, string> = {
  Happy: '#581C87',
  Calm: '#6B21A8',
  Okay: '#7C3AED',
  Tired: '#8B5CF6',
  Anxious: '#A78BFA',
  Sad: '#C4B5FD',
  Irritable: '#DDD6FE',
  Upset: '#EDE9FE',
};

async function handler(_req: NextRequest, _payload: JwtPayload) {
  try {
    await connectDB();

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [totalEntries, prevMonthEntries, moodCounts] = await Promise.all([
      MoodLog.countDocuments({ createdAt: { $gte: monthStart } }),
      MoodLog.countDocuments({ createdAt: { $gte: prevMonthStart, $lt: monthStart } }),
      MoodLog.aggregate([
        { $group: { _id: '$mood', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    const entriesChange =
      prevMonthEntries > 0
        ? (((totalEntries - prevMonthEntries) / prevMonthEntries) * 100).toFixed(1)
        : 0;

    const total = moodCounts.reduce((sum, m) => sum + m.count, 0);

    const moodDistribution = moodCounts.map((m) => ({
      name: m._id,
      value: total > 0 ? Math.round((m.count / total) * 100) : 0,
      color: MOOD_COLORS[m._id] || '#7C3AED',
    }));

    return apiResponse({
      totalEntries,
      entriesChange: Number(entriesChange),
      moodDistribution,
    });
  } catch (error) {
    console.error('[GET /api/analytics/mood]', error);
    return apiError('Internal server error');
  }
}

export const GET = requireAuth(handler);
