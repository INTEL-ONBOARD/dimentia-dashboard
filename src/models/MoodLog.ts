import mongoose, { Schema, Document } from 'mongoose';

export type MoodType = 'Happy' | 'Calm' | 'Okay' | 'Tired' | 'Anxious' | 'Sad' | 'Irritable' | 'Upset';

export interface IMoodLog extends Document {
  userId: mongoose.Types.ObjectId;
  mood: MoodType;
  notes?: string;
  loggedAt: Date;
  createdAt: Date;
}

const MoodLogSchema = new Schema<IMoodLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'AppUser', required: true },
    mood: {
      type: String,
      enum: ['Happy', 'Calm', 'Okay', 'Tired', 'Anxious', 'Sad', 'Irritable', 'Upset'],
      required: true,
    },
    notes: { type: String },
    loggedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

MoodLogSchema.index({ loggedAt: -1 });
MoodLogSchema.index({ userId: 1 });

export default mongoose.models.MoodLog ||
  mongoose.model<IMoodLog>('MoodLog', MoodLogSchema);
