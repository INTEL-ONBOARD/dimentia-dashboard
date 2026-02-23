import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import AppUser from '@/models/AppUser';
import Session from '@/models/Session';
import Article from '@/models/Article';
import SymptomLog from '@/models/SymptomLog';
import Reminder from '@/models/Reminder';
import { requireAuth, apiResponse, apiError, JwtPayload } from '@/lib/auth';

async function handler(_req: NextRequest, _payload: JwtPayload) {
  try {
    await connectDB();

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      totalUsers,
      prevMonthUsers,
      dauToday,
      dauYesterday,
      mauThisMonth,
      mauLastMonth,
      totalSessions,
      prevMonthSessions,
      articlesRead,
      symptomsLogged,
      activeReminders,
      totalPoints,
    ] = await Promise.all([
      AppUser.countDocuments(),
      AppUser.countDocuments({ createdAt: { $lt: monthStart } }),
      AppUser.countDocuments({ lastActive: { $gte: todayStart } }),
      AppUser.countDocuments({
        lastActive: {
          $gte: new Date(todayStart.getTime() - 86400000),
          $lt: todayStart,
        },
      }),
      AppUser.countDocuments({ lastActive: { $gte: monthStart } }),
      AppUser.countDocuments({ lastActive: { $gte: prevMonthStart, $lt: monthStart } }),
      Session.countDocuments(),
      Session.countDocuments({ createdAt: { $lt: monthStart } }),
      Article.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
      SymptomLog.countDocuments(),
      Reminder.countDocuments({ status: 'Active' }),
      AppUser.aggregate([{ $group: { _id: null, total: { $sum: '$totalPoints' } } }]),
    ]);

    const userGrowth =
      prevMonthUsers > 0
        ? (((totalUsers - prevMonthUsers) / prevMonthUsers) * 100).toFixed(1)
        : 0;
    const dauChange =
      dauYesterday > 0
        ? (((dauToday - dauYesterday) / dauYesterday) * 100).toFixed(1)
        : 0;
    const mauChange =
      mauLastMonth > 0
        ? (((mauThisMonth - mauLastMonth) / mauLastMonth) * 100).toFixed(1)
        : 0;
    const sessionChange =
      prevMonthSessions > 0
        ? (((totalSessions - prevMonthSessions) / prevMonthSessions) * 100).toFixed(1)
        : 0;

    return apiResponse({
      totalUsers,
      dailyActiveUsers: dauToday,
      monthlyActiveUsers: mauThisMonth,
      totalSessions,
      articlesRead: articlesRead[0]?.total || 0,
      symptomsLogged,
      activeReminders,
      totalPoints: totalPoints[0]?.total || 0,
      userGrowth: Number(userGrowth),
      dauChange: Number(dauChange),
      mauChange: Number(mauChange),
      sessionChange: Number(sessionChange),
    });
  } catch (error) {
    console.error('[GET /api/metrics]', error);
    return apiError('Internal server error');
  }
}

export const GET = requireAuth(handler);
