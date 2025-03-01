export const config = {
  matcher: '/api/:path*',
};

export default function middleware(request) {
  // Clone the request headers
  const requestHeaders = new Headers(request.headers);
  
  // Add CORS headers to the request
  requestHeaders.set('Access-Control-Allow-Credentials', 'true');
  requestHeaders.set('Access-Control-Allow-Origin', '*');
  requestHeaders.set('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  requestHeaders.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // Handle OPTIONS request
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: requestHeaders,
    });
  }

  // Forward the request with the modified headers
  return fetch(request, {
    headers: requestHeaders,
  });
} 