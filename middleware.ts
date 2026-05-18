import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/profile', '/dashboard'];
const authRoutes = ['/auth/login', '/auth/register'];
const publicRoutes = ['/auth', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get('access_token')?.value;

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  const hasLangPrefix = /^\/(ru|kz)(?:\/|$)/.test(pathname);
  const isRoot = pathname === '/';

  if (!isPublicRoute && !isRoot && !hasLangPrefix) {
    const LANGUAGE_KEY = 'nps_language';
    const langCookie = request.cookies.get(LANGUAGE_KEY)?.value;
    const defaultLang = langCookie || 'ru';

    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLang}${pathname}`;
    return NextResponse.redirect(url);
  }

  if (isRoot) {
    const LANGUAGE_KEY = 'nps_language';
    const langCookie = request.cookies.get(LANGUAGE_KEY)?.value;
    const defaultLang = langCookie || 'ru';

    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLang}`;
    return NextResponse.redirect(url);
  }

  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
