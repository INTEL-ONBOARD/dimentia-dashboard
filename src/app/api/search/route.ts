import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import AppUser from '@/models/AppUser';
import Article from '@/models/Article';
import { requireAuth, apiResponse, apiError, JwtPayload } from '@/lib/auth';

async function handler(req: NextRequest, _payload: JwtPayload) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';

    if (!q.trim()) {
      return apiResponse({ users: [], articles: [] });
    }

    await connectDB();

    const regex = new RegExp(q, 'i');

    const [users, articles] = await Promise.all([
      AppUser.find({ fullName: regex }).limit(10).select('fullName role status age'),
      Article.find({ $or: [{ title: regex }, { category: regex }] })
        .limit(10)
        .select('title category views'),
    ]);

    return apiResponse({
      users: users.map((u) => ({
        id: u._id.toString(),
        fullName: u.fullName,
        role: u.role,
        status: u.status,
        age: u.age,
      })),
      articles: articles.map((a) => ({
        id: a._id.toString(),
        title: a.title,
        category: a.category,
        views: a.views,
      })),
    });
  } catch (error) {
    console.error('[GET /api/search]', error);
    return apiError('Internal server error');
  }
}

export const GET = requireAuth(handler);
