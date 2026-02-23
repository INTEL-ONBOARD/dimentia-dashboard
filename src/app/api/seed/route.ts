/**
 * POST /api/seed
 * Seeds the database with an initial admin user.
 * Protected by a seed secret — REMOVE or disable this route in production.
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import AdminUser from '@/models/AdminUser';

export async function POST(req: NextRequest) {
  const seedSecret = process.env.SEED_SECRET;

  // Require a secret header to prevent accidental public access
  if (seedSecret) {
    const providedSecret = req.headers.get('x-seed-secret');
    if (providedSecret !== seedSecret) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
  }

  try {
    await connectDB();

    const existing = await AdminUser.findOne({ email: 'admin@dimentia.com' });
    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'Admin user already exists',
        email: 'admin@dimentia.com',
      });
    }

    const admin = new AdminUser({
      name: 'Admin',
      email: 'admin@dimentia.com',
      password: 'Admin@2026!',
      role: 'admin',
    });

    await admin.save(); // pre-save hook hashes the password

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      email: 'admin@dimentia.com',
      password: 'Admin@2026!',
    });
  } catch (error) {
    console.error('[POST /api/seed]', error);
    return NextResponse.json({ success: false, message: 'Seed failed' }, { status: 500 });
  }
}
