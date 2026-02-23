/**
 * Run with: npx ts-node -e "require('./scripts/seed-admin.ts')"
 * Or add to package.json: "seed": "ts-node scripts/seed-admin.ts"
 *
 * Creates the initial admin user in MongoDB if one doesn't exist.
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not set');
  process.exit(1);
}

const AdminUserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, lowercase: true },
    password: String,
    role: { type: String, default: 'admin' },
  },
  { timestamps: true }
);

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const AdminUser =
    mongoose.models.AdminUser || mongoose.model('AdminUser', AdminUserSchema);

  const existing = await AdminUser.findOne({ email: 'admin@dimentia.com' });
  if (existing) {
    console.log('Admin user already exists:', existing.email);
    await mongoose.disconnect();
    return;
  }

  const password = await bcrypt.hash('Admin@2026!', 10);

  const admin = await AdminUser.create({
    name: 'Admin',
    email: 'admin@dimentia.com',
    password,
    role: 'admin',
  });

  console.log('Admin user created:', admin.email);
  console.log('Password: Admin@2026!');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
