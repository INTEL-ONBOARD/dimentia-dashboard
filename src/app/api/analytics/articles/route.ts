import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Article from '@/models/Article';
import { requireAuth, apiResponse, apiError, JwtPayload } from '@/lib/auth';

async function handler(_req: NextRequest, _payload: JwtPayload) {
  try {
    await connectDB();

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [articles, thisMonthAgg, lastMonthAgg] = await Promise.all([
      Article.find().sort({ views: -1 }).limit(20),
      Article.aggregate([
        { $match: { createdAt: { $gte: monthStart } } },
        {
          $group: {
            _id: null,
            totalCompletions: { $sum: '$completions' },
            totalBookmarks: { $sum: '$bookmarks' },
            avgCompletionRate: { $avg: '$completionRate' },
          },
        },
      ]),
      Article.aggregate([
        { $match: { createdAt: { $gte: prevMonthStart, $lt: monthStart } } },
        {
          $group: {
            _id: null,
            totalCompletions: { $sum: '$completions' },
            totalBookmarks: { $sum: '$bookmarks' },
          },
        },
      ]),
    ]);

    const thisMonth = thisMonthAgg[0] || {
      totalCompletions: 0,
      totalBookmarks: 0,
      avgCompletionRate: 0,
    };
    const lastMonth = lastMonthAgg[0] || { totalCompletions: 0, totalBookmarks: 0 };

    const completionsChange =
      lastMonth.totalCompletions > 0
        ? (
            ((thisMonth.totalCompletions - lastMonth.totalCompletions) /
              lastMonth.totalCompletions) *
            100
          ).toFixed(1)
        : 0;

    const bookmarksChange =
      lastMonth.totalBookmarks > 0
        ? (
            ((thisMonth.totalBookmarks - lastMonth.totalBookmarks) /
              lastMonth.totalBookmarks) *
            100
          ).toFixed(1)
        : 0;

    const formattedArticles = articles.map((a, idx) => ({
      id: idx + 1,
      title: a.title,
      category: a.category,
      views: a.views,
      completions: a.completions,
      completionRate: a.completionRate,
      bookmarks: a.bookmarks,
    }));

    return apiResponse({
      totalCompletions: thisMonth.totalCompletions,
      completionsChange: Number(completionsChange),
      avgCompletionRate: Math.round(thisMonth.avgCompletionRate || 0),
      completionRateChange: 0,
      totalBookmarks: thisMonth.totalBookmarks,
      bookmarksChange: Number(bookmarksChange),
      topArticles: formattedArticles.slice(0, 5),
      articles: formattedArticles,
    });
  } catch (error) {
    console.error('[GET /api/analytics/articles]', error);
    return apiError('Internal server error');
  }
}

export const GET = requireAuth(handler);
