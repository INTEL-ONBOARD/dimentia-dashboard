import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import AppUser from '@/models/AppUser';
import { signToken, apiResponse, apiError } from '@/lib/auth';

/**
 * POST /api/mobile/auth/login
 * Authenticate an existing mobile app user and return a JWT.
 *
 * Body:
 *   email    string  required
 *   password string  required
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return apiError('email and password are required', 400);
    }

    const user = await AppUser.findOne({ email: email.toLowerCase() });
    if (!user || !user.passwordHash) {
      return apiError('Invalid email or password', 401);
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return apiError('Invalid email or password', 401);
    }

    // Update lastActive on login
    user.lastActive = new Date();
    user.status = 'Active';
    await user.save();

    const token = signToken({ id: String(user._id), email: user.email!, role: user.role });

    return apiResponse({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        age: user.age,
        gender: user.gender,
        totalPoints: user.totalPoints,
        totalSessions: user.totalSessions,
        status: user.status,
        registeredDate: user.registeredDate,
        lastActive: user.lastActive,
      },
    });
  } catch (error) {
    console.error('[mobile/auth/login]', error);
    return apiError('Login failed', 500);
  }
}
