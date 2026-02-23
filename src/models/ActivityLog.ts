import mongoose, { Schema, Document } from 'mongoose';

export type ActivityType = 'user_registered' | 'article_completed' | 'symptom_logged' | 'reminder_created' | 'exercise_completed' | 'mood_logged' | 'session_started';

export interface IActivityLog extends Document {
  action: string;
  userName: string;
  userId?: mongoose.Types.ObjectId;
  type: ActivityType;
  createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    action: { type: String, required: true },
    userName: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'AppUser' },
    type: {
      type: String,
      enum: ['user_registered', 'article_completed', 'symptom_logged', 'reminder_created', 'exercise_completed', 'mood_logged', 'session_started'],
      required: true,
    },
  },
  { timestamps: true }
);

ActivityLogSchema.index({ createdAt: -1 });

export default mongoose.models.ActivityLog ||
  mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
