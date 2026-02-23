import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import AppUser from '@/models/AppUser';
import { requireAuth, apiError, JwtPayload } from '@/lib/auth';

function toCSV(users: any[]): string {
  const headers = [
    'ID',
    'Full Name',
    'Age',
    'Gender',
    'Role',
    'Registered Date',
    'Last Active',
    'Total Sessions',
    'Total Points',
    'Status',
  ];

  const rows = users.map((u) => [
    u._id.toString(),
    `"${u.fullName}"`,
    u.age,
    u.gender,
    u.role,
    u.registeredDate.toISOString().split('T')[0],
    u.lastActive.toISOString().split('T')[0],
    u.totalSessions,
    u.totalPoints,
    u.status,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

async function handler(req: NextRequest, _payload: JwtPayload) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'csv';

    await connectDB();

    const users = await AppUser.find().sort({ lastActive: -1 });

    if (format === 'csv') {
      const csv = toCSV(users);
      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="users.csv"',
        },
      });
    }

    // Default: JSON
    return new NextResponse(JSON.stringify(users), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="users.json"',
      },
    });
  } catch (error) {
    console.error('[GET /api/export/users]', error);
    return apiError('Internal server error');
  }
}

export const GET = requireAuth(handler);
