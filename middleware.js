import { NextResponse } from 'next/server';

export function middleware(request) {
    // Define the routes you want to block
    const blockedRoutes = ['/reset-password'];

    // Check if the current URL is in the blocked routes list
    if (blockedRoutes.includes(request.nextUrl.pathname)) {
        // Implement your authentication logic here
        // For demonstration, we assume a simple check for a query parameter 'auth'
        const isAuthorized = request.nextUrl.searchParams.get('token');

        if (!isAuthorized) {
            // If unauthorized, redirect to a custom error page or login page
            return NextResponse.redirect(new URL('/404', request.url));
        };
    };
  
    // Define the routes you want to open only auth users.
    const authRoutes = [
        '/quarters', 
        '/permits', 
        '/vehicles', 
        '/history', 
        '/profile', 
        '/form/carrier-info', 
        '/form/questionnaire', 
        '/form/payment-info'
    ];

    // Check if the current URL is in the auth routes list
    if(authRoutes.includes(request.nextUrl.pathname)) {
        // Get cookies from the request headers
        const authCookie = request.cookies.get('authorized');

        if(!authCookie) {
            // If unauthorized, redirect to a custom error page or login page
            return NextResponse.redirect(new URL('/sign-in', request.url));
        };
    };

    if(request.nextUrl.pathname === '/payment' && !(request.cookies.get('hash') || request.nextUrl.searchParams.get('token'))){
        return NextResponse.redirect(new URL('/404', request.url));
    };

    // Allow the request to proceed if it passes the check
    return NextResponse.next();
};
  
// Configure the matcher to apply the middleware to specific routes
export const config = {
    matcher: [
        '/reset-password',
        '/quarters',
        '/permits',
        '/vehicles',
        '/history',
        '/profile',
        '/form/carrier-info',
        '/form/questionnaire',
        '/form/payment-info',
        '/payment',
        '/404'
    ],
};