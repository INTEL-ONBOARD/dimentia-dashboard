import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Article from '@/models/Article';
import { requireAuth, apiError, JwtPayload } from '@/lib/auth';

function toCSV(articles: any[]): string {
  const headers = ['ID', 'Title', 'Category', 'Views', 'Completions', 'Completion Rate (%)', 'Bookmarks'];

  const rows = articles.map((a, idx) => [
    idx + 1,
    `"${a.title}"`,
    `"${a.category}"`,
    a.views,
    a.completions,
    a.completionRate,
    a.bookmarks,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

async function handler(req: NextRequest, _payload: JwtPayload) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'csv';

    await connectDB();

    const articles = await Article.find().sort({ views: -1 });

    if (format === 'csv') {
      const csv = toCSV(articles);
      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="articles.csv"',
        },
      });
    }

    return new NextResponse(JSON.stringify(articles), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="articles.json"',
      },
    });
  } catch (error) {
    console.error('[GET /api/export/articles]', error);
    return apiError('Internal server error');
  }
}

export const GET = requireAuth(handler);
