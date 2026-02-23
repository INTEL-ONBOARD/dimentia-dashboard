import { NextRequest } from 'next/server';
import { requireAuth, apiResponse, apiError, JwtPayload } from '@/lib/auth';

// Settings are stored client-side (Zustand persist). These endpoints
// act as a pass-through for future server-side persistence.
// The dashboard currently stores settings in localStorage via Zustand.

const defaultSettings = {
  theme: 'system',
  dateRange: 'last30days',
  refreshInterval: 300,
  chartAnimations: true,
  notifications: {
    email: true,
    push: true,
    slack: false,
    sms: false,
    weekly: true,
  },
  privacy: {
    analyticsTracking: true,
    personalizedExperience: true,
    shareAnonymousData: false,
  },
  dataRetention: 90,
};

async function getHandler(_req: NextRequest, _payload: JwtPayload) {
  try {
    return apiResponse(defaultSettings);
  } catch (error) {
    console.error('[GET /api/settings]', error);
    return apiError('Internal server error');
  }
}

async function putHandler(req: NextRequest, _payload: JwtPayload) {
  try {
    const body = await req.json();
    // Merge with defaults to ensure all fields are present
    const merged = { ...defaultSettings, ...body };
    return apiResponse(merged);
  } catch (error) {
    console.error('[PUT /api/settings]', error);
    return apiError('Internal server error');
  }
}

export const GET = requireAuth(getHandler);
export const PUT = requireAuth(putHandler);
