import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // The AdminLayout handles its own authentication state by showing a login form if no admin is found.
  // We don't need to redirect here as it would cause 404s or loops.
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
