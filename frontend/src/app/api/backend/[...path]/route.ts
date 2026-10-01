import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3050";
const AUTH_COOKIE_NAME = "neo_hire_token";

async function proxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }

  const { path } = await context.params;
  const url = new URL(`${BACKEND_API_URL}/api/${path.join("/")}`);
  url.search = request.nextUrl.search;

  const headers = new Headers();
  headers.set("Authorization", `Bearer ${token}`);
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);

  const hasBody = !["GET", "HEAD"].includes(request.method);
  const backendResponse = await fetch(url, {
    method: request.method,
    headers,
    body: hasBody ? await request.text() : undefined,
    cache: "no-store",
  });

  const responseHeaders = new Headers();
  const responseContentType = backendResponse.headers.get("content-type");
  if (responseContentType) responseHeaders.set("Content-Type", responseContentType);

  if (backendResponse.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const response = new NextResponse(await backendResponse.text(), {
    status: backendResponse.status,
    headers: responseHeaders,
  });
  if (backendResponse.status === 401) {
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });
  }
  return response;
}

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
