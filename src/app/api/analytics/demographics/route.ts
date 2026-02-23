import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import AppUser from '@/models/AppUser';
import { requireAuth, apiResponse, apiError, JwtPayload } from '@/lib/auth';

const ROLE_COLORS: Record<string, string> = {
  Patient: '#7C3AED',
  Caregiver: '#A78BFA',
};

const GENDER_COLORS: Record<string, string> = {
  Male: '#6B21A8',
  Female: '#8B5CF6',
  Other: '#C4B5FD',
};

function getAgeGroup(age: number): string {
  if (age < 31) return '18-30';
  if (age < 46) return '31-45';
  if (age < 61) return '46-60';
  if (age < 76) return '61-75';
  return '76+';
}

async function handler(_req: NextRequest, _payload: JwtPayload) {
  try {
    await connectDB();

    const [byRoleData, byGenderData, allUsers] = await Promise.all([
      AppUser.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
      AppUser.aggregate([{ $group: { _id: '$gender', count: { $sum: 1 } } }]),
      AppUser.find({}, { age: 1 }),
    ]);

    const byRole = byRoleData.map((r) => ({
      name: r._id,
      value: r.count,
      color: ROLE_COLORS[r._id] || '#7C3AED',
    }));

    const byGender = byGenderData.map((r) => ({
      name: r._id,
      value: r.count,
      color: GENDER_COLORS[r._id] || '#7C3AED',
    }));

    // Build age group counts
    const ageCounts: Record<string, number> = {
      '18-30': 0,
      '31-45': 0,
      '46-60': 0,
      '61-75': 0,
      '76+': 0,
    };
    for (const user of allUsers) {
      const group = getAgeGroup(user.age);
      ageCounts[group]++;
    }

    const byAge = Object.entries(ageCounts).map(([ageGroup, count]) => ({
      ageGroup,
      count,
    }));

    return apiResponse({ byRole, byGender, byAge });
  } catch (error) {
    console.error('[GET /api/analytics/demographics]', error);
    return apiError('Internal server error');
  }
}

export const GET = requireAuth(handler);
