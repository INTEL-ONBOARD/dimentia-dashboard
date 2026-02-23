import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Reminder from '@/models/Reminder';
import AppUser from '@/models/AppUser';
import { requireAuth, apiResponse, apiError, JwtPayload } from '@/lib/auth';

async function handler(_req: NextRequest, _payload: JwtPayload) {
  try {
    await connectDB();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart.getTime() + 86400000);

    const [
      peakHourAgg,
      avgPerUserAgg,
      missedToday,
      totalToday,
      byTypeAgg,
    ] = await Promise.all([
      // Peak hour: which hour of day has the most reminders
      Reminder.aggregate([
        {
          $group: {
            _id: { $hour: '$scheduledTime' },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 1 },
      ]),

      // Average reminders per user
      Reminder.aggregate([
        {
          $group: {
            _id: '$userId',
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: null,
            avg: { $avg: '$count' },
          },
        },
      ]),

      // Missed today
      Reminder.countDocuments({
        status: 'Missed',
        scheduledTime: { $gte: todayStart, $lt: todayEnd },
      }),

      // Total today
      Reminder.countDocuments({
        scheduledTime: { $gte: todayStart, $lt: todayEnd },
      }),

      // By type distribution
      Reminder.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    // Format peak hour
    let peakTime = 'N/A';
    if (peakHourAgg.length > 0) {
      const hour = peakHourAgg[0]._id;
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      peakTime = `${displayHour}:00 ${period}`;
    }

    const avgPerUser = parseFloat((avgPerUserAgg[0]?.avg || 0).toFixed(1));
    const missedPercent = totalToday > 0 ? Math.round((missedToday / totalToday) * 100) : 0;

    const typeDistribution = byTypeAgg.map((t) => ({
      type: t._id.charAt(0).toUpperCase() + t._id.slice(1),
      count: t.count,
    }));

    return apiResponse({
      peakTime,
      avgPerUser,
      missedToday,
      missedPercent,
      typeDistribution,
    });
  } catch (error) {
    console.error('[GET /api/analytics/reminders/insights]', error);
    return apiError('Internal server error');
  }
}

export const GET = requireAuth(handler);
