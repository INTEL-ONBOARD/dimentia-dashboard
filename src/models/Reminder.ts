import mongoose, { Schema, Document } from 'mongoose';

export interface IReminder extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'medication' | 'voice' | 'appointment' | 'other';
  title: string;
  scheduledTime: Date;
  status: 'Active' | 'Inactive' | 'Completed' | 'Missed';
  isVoice: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReminderSchema = new Schema<IReminder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'AppUser', required: true },
    type: {
      type: String,
      enum: ['medication', 'voice', 'appointment', 'other'],
      default: 'other',
    },
    title: { type: String, required: true },
    scheduledTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Completed', 'Missed'],
      default: 'Active',
    },
    isVoice: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ReminderSchema.index({ userId: 1 });
ReminderSchema.index({ status: 1 });
ReminderSchema.index({ scheduledTime: 1 });

export default mongoose.models.Reminder ||
  mongoose.model<IReminder>('Reminder', ReminderSchema);
