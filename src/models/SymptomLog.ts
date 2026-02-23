import mongoose, { Schema, Document } from 'mongoose';

export interface ISymptomLog extends Document {
  userId: mongoose.Types.ObjectId;
  symptoms: string[];
  notes?: string;
  loggedAt: Date;
  createdAt: Date;
}

const SymptomLogSchema = new Schema<ISymptomLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'AppUser', required: true },
    symptoms: [{ type: String, required: true }],
    notes: { type: String },
    loggedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

SymptomLogSchema.index({ loggedAt: -1 });
SymptomLogSchema.index({ userId: 1 });

export default mongoose.models.SymptomLog ||
  mongoose.model<ISymptomLog>('SymptomLog', SymptomLogSchema);
