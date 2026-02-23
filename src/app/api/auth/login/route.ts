import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import AdminUser from '@/models/AdminUser';
import { signToken, apiResponse, apiError } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return apiError('Email and password are required', 400);
    }

    await connectDB();

    const user = await AdminUser.findOne({ email: email.toLowerCase() });
    if (!user) {
      return apiError('Invalid credentials', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return apiError('Invalid credentials', 401);
    }

    const token = signToken({ id: user._id.toString(), email: user.email, role: user.role });

    return apiResponse({
      token,
      expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('[POST /api/auth/login]', error);
    return apiError('Internal server error');
  }
}
