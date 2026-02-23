import mongoose, { Schema, Document } from 'mongoose';

export interface IArticle extends Document {
  articleId: string;
  title: string;
  category: string;
  views: number;
  completions: number;
  completionRate: number;
  bookmarks: number;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema = new Schema<IArticle>(
  {
    articleId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    views: { type: Number, default: 0 },
    completions: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },
    bookmarks: { type: Number, default: 0 },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ArticleSchema.index({ title: 'text', category: 'text' });
ArticleSchema.index({ views: -1 });

export default mongoose.models.Article ||
  mongoose.model<IArticle>('Article', ArticleSchema);
