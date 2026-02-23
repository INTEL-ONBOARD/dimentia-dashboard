import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Article from '@/models/Article';
import AppUser from '@/models/AppUser';
import ActivityLog from '@/models/ActivityLog';
import { apiResponse, apiError, JwtPayload } from '@/lib/auth';
import { requireMobileAuth } from '@/lib/mobileAuth';
import { createNotification } from '@/lib/createNotification';

const VALID_ACTIONS = ['view', 'complete', 'bookmark', 'unbookmark'];

/**
 * POST /api/mobile/articles/interact
 * Record a user interaction with an article.
 * If the article doesn't exist yet, it is created on first interaction
 * (so the mobile app can push article metadata along with interactions).
 *
 * Authorization: Bearer <token>
 *
 * Body:
 *   articleId    string   required  (MongoDB ObjectId OR a stable string ID from mobile)
 *   action       "view"|"complete"|"bookmark"|"unbookmark"  required
 *   title        string   required on first creation
 *   category     string   required on first creation
 */
async function interactWithArticle(req: NextRequest, authUser: JwtPayload): Promise<NextResponse> {
  try {
    await connectDB();

    const body = await req.json();
    const { articleId, action, title, category } = body;

    if (!articleId || !action) {
      return apiError('articleId and action are required', 400);
    }

    if (!VALID_ACTIONS.includes(action)) {
      return apiError(`action must be one of: ${VALID_ACTIONS.join(', ')}`, 400);
    }

    // Build the atomic update based on action
    let articleUpdate: Record<string, unknown> = {};
    let pointsEarned = 0;
    let activityAction = '';

    switch (action) {
      case 'view':
        articleUpdate = { $inc: { views: 1 } };
        pointsEarned = 1;
        activityAction = 'Viewed an article';
        break;
      case 'complete':
        articleUpdate = { $inc: { completions: 1 } };
        pointsEarned = 10;
        activityAction = 'Completed an article';
        break;
      case 'bookmark':
        articleUpdate = { $inc: { bookmarks: 1 } };
        pointsEarned = 2;
        activityAction = 'Bookmarked an article';
        break;
      case 'unbookmark':
        articleUpdate = { $inc: { bookmarks: -1 } };
        activityAction = 'Removed bookmark from an article';
        break;
    }

    // Find existing article by stable articleId string, or create it (upsert)
    if (!title || !category) {
      // title+category needed for upsert setOnInsert — check if article already exists first
      const existing = await Article.findOne({ articleId });
      if (!existing) {
        return apiError('title and category are required when creating a new article record', 400);
      }
    }

    const article = await Article.findOneAndUpdate(
      { articleId },
      {
        ...articleUpdate,
        $setOnInsert: { title: title || articleId, category: category || 'General', articleId },
      },
      { upsert: true, new: true },
    );

    // Recalculate completionRate if needed
    if (article && (action === 'complete' || action === 'view') && article.views > 0) {
      const rate = Math.round((article.completions / article.views) * 100);
      await Article.findByIdAndUpdate(article._id, { completionRate: rate });
    }

    // Update user points and lastActive
    if (pointsEarned > 0) {
      await AppUser.findByIdAndUpdate(authUser.id, {
        $inc: { totalPoints: pointsEarned },
        $set: { lastActive: new Date(), status: 'Active' },
      });
    }

    // Write to activity feed for meaningful actions
    if (action === 'complete') {
      await ActivityLog.create({
        action: `Completed article: ${article.title}`,
        userName: authUser.email,
        userId: authUser.id,
        type: 'article_completed',
      });
      await createNotification(
        'Article Completed',
        `A user completed "${article.title}" (+10 points)`,
        'success',
        '/engagement'
      );
    } else if (action === 'bookmark') {
      await createNotification(
        'Article Bookmarked',
        `A user bookmarked "${article.title}"`,
        'info',
        '/engagement'
      );
    }

    return apiResponse({ articleId: article._id, pointsEarned }, 200);
  } catch (error) {
    console.error('[mobile/articles/interact POST]', error);
    return apiError('Failed to record article interaction', 500);
  }
}

export const POST = requireMobileAuth(interactWithArticle);
