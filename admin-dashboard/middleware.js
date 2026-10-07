import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Next.js Edge Middleware — runs BEFORE every request.
 * Redirects unauthenticated users to /login for protected routes.
 */
export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Public routes that don't need auth
  const publicPaths = ['/login', '/api/auth'];
  const isPublic = publicPaths.some(p => pathname.startsWith(p));
  if (isPublic) return NextResponse.next();

  // Static assets
  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // Check JWT token
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  // Not authenticated → redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based route protection
  const adminOnlyPaths = ['/dashboard/users'];
  const isAdminRoute = adminOnlyPaths.some(p => pathname.startsWith(p));
  
  if (isAdminRoute && token.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard?error=forbidden', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
