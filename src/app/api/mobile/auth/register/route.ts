import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import AppUser from '@/models/AppUser';
import ActivityLog from '@/models/ActivityLog';
import { signToken, apiResponse, apiError } from '@/lib/auth';

/**
 * POST /api/mobile/auth/register
 * Register a new mobile app user (patient or caregiver).
 *
 * Body:
 *   fullName    string  required
 *   email       string  required  (used for login)
 *   password    string  required  (min 6 chars)
 *   age         number  required
 *   gender      "Male" | "Female" | "Other"  required
 *   role        "Patient" | "Caregiver"      required
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { fullName, email, password, age, gender, role } = body;

    if (!fullName || !email || !password || !age || !gender || !role) {
      return apiError('fullName, email, password, age, gender, and role are required', 400);
    }

    if (password.length < 6) {
      return apiError('Password must be at least 6 characters', 400);
    }

    if (!['Male', 'Female', 'Other'].includes(gender)) {
      return apiError('gender must be Male, Female, or Other', 400);
    }

    if (!['Patient', 'Caregiver'].includes(role)) {
      return apiError('role must be Patient or Caregiver', 400);
    }

    const existing = await AppUser.findOne({ email: email.toLowerCase() });
    if (existing) {
      return apiError('An account with this email already exists', 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await AppUser.create({
      fullName,
      email: email.toLowerCase(),
      passwordHash,
      age: Number(age),
      gender,
      role,
    });

    // Log registration activity
    await ActivityLog.create({
      action: `${fullName} registered as ${role}`,
      userName: fullName,
      userId: user._id,
      type: 'user_registered',
    });

    const token = signToken({ id: String(user._id), email: user.email!, role: user.role });

    return apiResponse(
      {
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
        },
      },
      201
    );
  } catch (error) {
    console.error('[mobile/auth/register]', error);
    return apiError('Registration failed', 500);
  }
}
