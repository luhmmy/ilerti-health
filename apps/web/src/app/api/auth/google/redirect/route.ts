import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const role = url.searchParams.get('role') || 'patient';
  const returnUrl = url.searchParams.get('returnUrl') || (role === 'doctor' ? '/doctor-portal' : '/dashboard');

  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  
  // Construct absolute redirect_uri
  const origin = url.origin;
  const redirectUri = `${origin}/api/auth/google/callback`;

  // Encode state with role and returnUrl
  const state = Buffer.from(JSON.stringify({ role, returnUrl })).toString('base64url');

  if (clientId) {
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleAuthUrl.searchParams.set('client_id', clientId);
    googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
    googleAuthUrl.searchParams.set('response_type', 'code');
    googleAuthUrl.searchParams.set('scope', 'openid email profile');
    googleAuthUrl.searchParams.set('access_type', 'offline');
    googleAuthUrl.searchParams.set('prompt', 'select_account');
    googleAuthUrl.searchParams.set('state', state);

    return NextResponse.redirect(googleAuthUrl.toString());
  }

  // If GOOGLE_CLIENT_ID is not yet configured in environment variables, redirect to Google Accounts sign-in URL with return
  const fallbackGoogleUrl = new URL('https://accounts.google.com/signin/v2/identifier');
  fallbackGoogleUrl.searchParams.set('flowName', 'GlifWebSignIn');
  fallbackGoogleUrl.searchParams.set('flowEntry', 'ServiceLogin');

  // Or redirect back to callback with demo state if offline testing
  const fallbackRedirect = `${origin}/api/auth/google/callback?state=${state}&demo=true`;
  return NextResponse.redirect(fallbackRedirect);
}
