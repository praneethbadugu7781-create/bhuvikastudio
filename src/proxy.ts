import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Only apply to admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Check for access token
  const accessToken = request.cookies.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Basic token validation (simplified - full validation in admin layout)
  try {
    // Token exists, allow request
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
