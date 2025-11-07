import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

import { env } from '@/env';
import { paths } from '@/constants/paths';
import { Database } from '@/types/supabase';

/**
 * Check if a route requires authentication
 */
function isProtectedRoute(pathname: string): boolean {
  const protectedRoutes = ['/'];
  return protectedRoutes.some((route) => pathname === route);
}

/**
 * Check if a route is an auth route (login/register)
 */
function isAuthRoute(pathname: string): boolean {
  const authRoutes = [paths.auth.login, paths.auth.register];
  return authRoutes.some((route) => pathname === route);
}

/**
 * Get authenticated user from Supabase session
 */
async function getAuthenticatedUser(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { user, response: supabaseResponse };
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get authenticated user and update session
  const { user, response } = await getAuthenticatedUser(request);
  const userAuthenticated = !!user;

  // Protect routes that require authentication
  if (isProtectedRoute(pathname) && !userAuthenticated) {
    const loginUrl = new URL(paths.auth.login, request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute(pathname) && userAuthenticated) {
    return NextResponse.redirect(new URL(paths.home, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
