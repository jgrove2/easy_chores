import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware() {
    // Add any custom middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect all routes except login and public pages
        const { pathname } = req.nextUrl;
        
        // Allow access to login page and public assets
        if (pathname === '/login' || pathname.startsWith('/_next') || pathname.startsWith('/api/auth')) {
          return true;
        }
        
        // Require authentication for all other routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};