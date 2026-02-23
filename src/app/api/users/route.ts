import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import AppUser from '@/models/AppUser';
import { requireAuth, apiResponse, apiError, JwtPayload } from '@/lib/auth';

async function handler(req: NextRequest, _payload: JwtPayload) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '20', 10));
    const search = searchParams.get('search') || '';
    const skip = (page - 1) * limit;

    await connectDB();

    const query = search
      ? { $text: { $search: search } }
      : {};

    const [users, total] = await Promise.all([
      AppUser.find(query).sort({ lastActive: -1 }).skip(skip).limit(limit),
      AppUser.countDocuments(query),
    ]);

    const formatted = users.map((u) => ({
      id: u._id.toString(),
      fullName: u.fullName,
      age: u.age,
      gender: u.gender,
      role: u.role,
      registeredDate: u.registeredDate.toISOString().split('T')[0],
      lastActive: u.lastActive.toISOString().split('T')[0],
      totalSessions: u.totalSessions,
      totalPoints: u.totalPoints,
      status: u.status,
    }));

    return apiResponse({
      users: formatted,
      total,
      page,
      pageSize: limit,
    });
  } catch (error) {
    console.error('[GET /api/users]', error);
    return apiError('Internal server error');
  }
}

export const GET = requireAuth(handler);
