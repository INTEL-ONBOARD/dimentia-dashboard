import { connectDB } from '@/lib/mongodb';
import NotificationModel from '@/models/Notification';

type NotificationType = 'info' | 'success' | 'warning' | 'error';

export async function createNotification(
  title: string,
  message: string,
  type: NotificationType = 'info',
  actionUrl?: string
): Promise<void> {
  try {
    await connectDB();
    await NotificationModel.create({ title, message, type, actionUrl });
  } catch (err) {
    // Never let notification creation crash the main request
    console.error('[createNotification]', err);
  }
}
