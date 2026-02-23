import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import SymptomLog from '@/models/SymptomLog';
import { requireAuth, apiResponse, apiError, JwtPayload } from '@/lib/auth';

async function handler(_req: NextRequest, _payload: JwtPayload) {
  try {
    await connectDB();

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      totalEntries,
      prevMonthEntries,
      symptomCounts,
      avgSymptomAgg,
    ] = await Promise.all([
      SymptomLog.countDocuments({ createdAt: { $gte: monthStart } }),
      SymptomLog.countDocuments({ createdAt: { $gte: prevMonthStart, $lt: monthStart } }),
      SymptomLog.aggregate([
        { $unwind: '$symptoms' },
        { $group: { _id: '$symptoms', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      SymptomLog.aggregate([
        { $project: { symptomCount: { $size: '$symptoms' } } },
        { $group: { _id: null, avg: { $avg: '$symptomCount' } } },
      ]),
    ]);

    const entriesChange =
      prevMonthEntries > 0
        ? (((totalEntries - prevMonthEntries) / prevMonthEntries) * 100).toFixed(1)
        : 0;

    const topSymptoms = symptomCounts.map((s) => ({
      symptom: s._id,
      count: s.count,
    }));

    // Tracking adherence: % of days in the month that had at least one log
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysLogged = await SymptomLog.aggregate([
      { $match: { createdAt: { $gte: monthStart } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
        },
      },
      { $count: 'total' },
    ]);
    const trackingAdherence = Math.round(
      ((daysLogged[0]?.total || 0) / daysInMonth) * 100
    );

    return apiResponse({
      totalEntries,
      entriesChange: Number(entriesChange),
      trackingAdherence,
      adherenceChange: 0,
      avgSymptomsPerEntry: parseFloat((avgSymptomAgg[0]?.avg || 0).toFixed(1)),
      avgChange: 0,
      topSymptoms,
    });
  } catch (error) {
    console.error('[GET /api/analytics/symptoms]', error);
    return apiError('Internal server error');
  }
}

export const GET = requireAuth(handler);
