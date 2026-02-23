import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  startedAt: Date;
  endedAt?: Date;
  durationSeconds: number;
  featuresUsed: string[];
  createdAt: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'AppUser', required: true },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
    durationSeconds: { type: Number, default: 0 },
    featuresUsed: [{ type: String }],
  },
  { timestamps: true }
);

SessionSchema.index({ startedAt: -1 });
SessionSchema.index({ userId: 1 });

export default mongoose.models.Session ||
  mongoose.model<ISession>('Session', SessionSchema);
