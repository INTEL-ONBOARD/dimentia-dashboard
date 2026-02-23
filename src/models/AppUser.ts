import mongoose, { Schema, Document } from 'mongoose';

export interface IAppUser extends Document {
  fullName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  role: 'Patient' | 'Caregiver';
  email?: string;
  passwordHash?: string;
  registeredDate: Date;
  lastActive: Date;
  totalSessions: number;
  totalPoints: number;
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

const AppUserSchema = new Schema<IAppUser>(
  {
    fullName: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    role: { type: String, enum: ['Patient', 'Caregiver'], required: true },
    email: { type: String, lowercase: true, unique: true, sparse: true },
    passwordHash: { type: String },
    registeredDate: { type: Date, default: Date.now },
    lastActive: { type: Date, default: Date.now },
    totalSessions: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
);

AppUserSchema.index({ fullName: 'text', email: 'text' });
AppUserSchema.index({ lastActive: -1 });
AppUserSchema.index({ status: 1 });

export default mongoose.models.AppUser ||
  mongoose.model<IAppUser>('AppUser', AppUserSchema);
