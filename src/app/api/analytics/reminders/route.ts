import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Reminder from '@/models/Reminder';
import { requireAuth, apiResponse, apiError, JwtPayload } from '@/lib/auth';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

async function handler(_req: NextRequest, _payload: JwtPayload) {
  try {
    await connectDB();

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      totalReminders,
      prevMonthTotal,
      activeReminders,
      voiceReminders,
      prevMonthVoice,
      completedReminders,
      statusCounts,
      byDayOfWeek,
    ] = await Promise.all([
      Reminder.countDocuments({ createdAt: { $gte: monthStart } }),
      Reminder.countDocuments({ createdAt: { $gte: prevMonthStart, $lt: monthStart } }),
      Reminder.countDocuments({ status: 'Active' }),
      Reminder.countDocuments({ isVoice: true, createdAt: { $gte: monthStart } }),
      Reminder.countDocuments({ isVoice: true, createdAt: { $gte: prevMonthStart, $lt: monthStart } }),
      Reminder.countDocuments({ status: 'Completed', createdAt: { $gte: monthStart } }),
      Reminder.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Reminder.aggregate([
        {
          $group: {
            _id: { $dayOfWeek: '$scheduledTime' }, // 1=Sun, 7=Sat
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const remindersChange =
      prevMonthTotal > 0
        ? (((totalReminders - prevMonthTotal) / prevMonthTotal) * 100).toFixed(1)
        : 0;

    const voiceChange =
      prevMonthVoice > 0
        ? (((voiceReminders - prevMonthVoice) / prevMonthVoice) * 100).toFixed(1)
        : 0;

    const completionRate =
      totalReminders > 0 ? Math.round((completedReminders / totalReminders) * 100) : 0;

    const STATUS_COLORS: Record<string, string> = {
      Active: '#7C3AED',
      Inactive: '#C4B5FD',
      Completed: '#A78BFA',
      Missed: '#DDD6FE',
    };

    const statusDistribution = statusCounts.map((s) => ({
      name: s._id,
      value: s.count,
      color: STATUS_COLORS[s._id] || '#7C3AED',
    }));

    // Build full 7-day array
    const dayCountMap: Record<number, number> = {};
    for (const d of byDayOfWeek) {
      dayCountMap[d._id] = d.count; // 1=Sun ... 7=Sat
    }
    const weekData = [1, 2, 3, 4, 5, 6, 7].map((dayNum) => ({
      day: DAY_NAMES[dayNum - 1],
      count: dayCountMap[dayNum] || 0,
    }));

    return apiResponse({
      totalReminders,
      remindersChange: Number(remindersChange),
      activeReminders,
      activeChange: 0,
      voiceReminders,
      voiceChange: Number(voiceChange),
      completionRate,
      completionChange: 0,
      statusDistribution,
      byDayOfWeek: weekData,
    });
  } catch (error) {
    console.error('[GET /api/analytics/reminders]', error);
    return apiError('Internal server error');
  }
}

export const GET = requireAuth(handler);
