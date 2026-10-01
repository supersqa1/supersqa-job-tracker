import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3050";
const AUTH_COOKIE_NAME = "neo_hire_token";

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const backendResponse = await fetch(`${BACKEND_API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const body = await backendResponse.json().catch(() => null);
  if (!backendResponse.ok) {
    return NextResponse.json(
      body ?? { detail: "Unable to sign in" },
      { status: backendResponse.status },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: body.access_token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: body.expires_in,
    path: "/",
  });
  return response;
}
