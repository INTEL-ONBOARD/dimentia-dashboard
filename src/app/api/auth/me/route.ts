import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import AdminUser from '@/models/AdminUser';
import { requireAuth, apiResponse, apiError, JwtPayload } from '@/lib/auth';

async function handler(req: NextRequest, payload: JwtPayload) {
  try {
    await connectDB();

    const user = await AdminUser.findById(payload.id).select('-password');
    if (!user) {
      return apiError('User not found', 404);
    }

    return apiResponse({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    });
  } catch (error) {
    console.error('[GET /api/auth/me]', error);
    return apiError('Internal server error');
  }
}

export const GET = requireAuth(handler);
