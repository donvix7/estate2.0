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
  const estateId = cookieStore.get('estateId')?.value;

  if (!storedRefreshToken) {
    return NextResponse.json({ success: false, message: 'No refresh token' }, { status: 401 });
  }

  try {
    const res = await fetch(`${db_url}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(estateId ? { 'x-estate-id': estateId } : {}),
      },
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

    const accessToken = data.accessToken || data.access_token || data.token ||
      data.data?.accessToken || data.data?.access_token || data.data?.token;
    const newRefreshToken =
      data.refreshToken || data.refresh_token || data.data?.refreshToken || data.data?.refresh_token;
    const user = data.user || data.data?.user || null;

    if (!accessToken) {
      return NextResponse.json({ success: false, message: 'No access token in response' }, { status: 401 });
    }

    const secure = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      path: '/',
      httpOnly: true,
      secure,
      sameSite: 'lax',
    };

    let expiresAt = null;
    try {
      const payload = JSON.parse(Buffer.from(accessToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));
      if (typeof payload.exp === 'number') expiresAt = payload.exp * 1000;
    } catch {}

    // Build the response with the refreshed cookies and access-token expiry.
    const response = NextResponse.json({
      success: true,
      expiresAt,
      expiresInMs: expiresAt ? Math.max(0, expiresAt - Date.now()) : null,
    });

    response.cookies.set('session_token', accessToken, { ...cookieOptions, maxAge: 60 * 60 * 24 });

    if (newRefreshToken) {
      response.cookies.set('refresh_token', newRefreshToken, { ...cookieOptions, maxAge: 60 * 60 * 24 * 7 });
    }

    if (user) {
      response.cookies.set('currentUser', JSON.stringify(user), cookieOptions);
    }

    console.log('[api/auth/refresh] Tokens refreshed successfully.');
    return response;
  } catch (error) {
    console.error('[api/auth/refresh] Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
