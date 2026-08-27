import { NextResponse } from 'next/server';

const db_url = process.env.DB_URL;

export async function POST() {
  if (!db_url) {
    return NextResponse.json({ success: false, message: 'DB_URL not configured' }, { status: 500 });
  }

  // Read refresh_token from the request cookie (httpOnly — accessible server-side)
  // Next.js route handlers don't expose cookies() on the request directly,
  // so we use a trick: the client sends a dummy body and we rely on
  // the cookie being forwarded. Actually, Next.js Request cookies ARE accessible.
  // However, in the App Router we need to use the cookies() helper from next/headers.
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const storedRefreshToken = cookieStore.get('refresh_token')?.value;

  if (!storedRefreshToken) {
    return NextResponse.json({ success: false, message: 'No refresh token' }, { status: 401 });
  }

  try {
    const res = await fetch(`${db_url}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: storedRefreshToken }),
      cache: 'no-store',
    });

    const data = await res.json();

    if (!res.ok || data.success === false) {
      return NextResponse.json(
        { success: false, message: data.message || data.errors?.[0] || 'Refresh failed' },
        { status: res.status || 401 }
      );
    }

    const accessToken =
      data.access_token || data.token || data.data?.access_token || data.data?.token;
    const newRefreshToken =
      data.refresh_token || data.refreshToken || data.data?.refresh_token;
    const user = data.user || data.data?.user || null;

    if (!accessToken) {
      return NextResponse.json({ success: false, message: 'No access token in response' }, { status: 401 });
    }

    // Build response with new cookies
    const response = NextResponse.json({ success: true });

    const secure = process.env.NODE_ENV === 'production';
    const cookieOpts = `Path=/; HttpOnly; ${secure ? 'Secure; ' : ''}SameSite=Lax`;

    response.cookies.set('session_token', accessToken, {
      path: '/',
      httpOnly: true,
      secure,
      sameSite: 'lax',
    });

    if (newRefreshToken) {
      response.cookies.set('refresh_token', newRefreshToken, {
        path: '/',
        httpOnly: true,
        secure,
        sameSite: 'lax',
      });
    }

    if (user) {
      response.cookies.set('currentUser', JSON.stringify(user), {
        path: '/',
        httpOnly: true,
        secure,
        sameSite: 'lax',
      });
    }

    console.log('[api/auth/refresh] Tokens refreshed successfully.');
    return response;
  } catch (error) {
    console.error('[api/auth/refresh] Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
