import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Notification from '@/models/Notification';
import { requireAuth, apiResponse, apiError, JwtPayload } from '@/lib/auth';

async function getHandler(_req: NextRequest, _payload: JwtPayload) {
  try {
    await connectDB();

    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(50);

    const formatted = notifications.map((n) => ({
      id: n._id.toString(),
      title: n.title,
      message: n.message,
      type: n.type,
      read: n.read,
      timestamp: n.createdAt,
      actionUrl: n.actionUrl,
    }));

    return apiResponse(formatted);
  } catch (error) {
    console.error('[GET /api/notifications]', error);
    return apiError('Internal server error');
  }
}

// PUT /api/notifications — mark ALL as read
async function markAllReadHandler(_req: NextRequest, _payload: JwtPayload) {
  try {
    await connectDB();
    await Notification.updateMany({ read: false }, { $set: { read: true } });
    return apiResponse({ success: true });
  } catch (error) {
    console.error('[PUT /api/notifications]', error);
    return apiError('Internal server error');
  }
}

// DELETE /api/notifications — delete all
async function deleteAllHandler(_req: NextRequest, _payload: JwtPayload) {
  try {
    await connectDB();
    await Notification.deleteMany({});
    return apiResponse({ success: true });
  } catch (error) {
    console.error('[DELETE /api/notifications]', error);
    return apiError('Internal server error');
  }
}

export const GET = requireAuth(getHandler);
export const PUT = requireAuth(markAllReadHandler);
export const DELETE = requireAuth(deleteAllHandler);
