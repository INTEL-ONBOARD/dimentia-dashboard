import { NextRequest } from 'next/server';
import { requireAuth, apiResponse, JwtPayload } from '@/lib/auth';

async function handler(_req: NextRequest, _payload: JwtPayload) {
  // JWT is stateless — client just drops the token.
  // If you later add a token blacklist, handle it here.
  return apiResponse({ message: 'Logged out successfully' });
}

export const POST = requireAuth(handler);
