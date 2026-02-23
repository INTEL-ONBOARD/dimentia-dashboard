import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { requireAuth, apiResponse, apiError, JwtPayload } from '@/lib/auth';

export function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return requireAuth(async (_r: NextRequest, _payload: JwtPayload) => {
    try {
      const { id } = await context.params;

      await connectDB();

      const notification = await Notification.findByIdAndUpdate(
        id,
        { read: true },
        { new: true }
      );

      if (!notification) {
        return apiError('Notification not found', 404);
      }

      return apiResponse({ id: notification._id.toString(), read: true });
    } catch (error) {
      console.error('[PUT /api/notifications/:id/read]', error);
      return apiError('Internal server error');
    }
  })(req);
}
