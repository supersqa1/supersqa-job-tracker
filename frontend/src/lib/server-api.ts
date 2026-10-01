import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { JobApplication } from "./types";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3050";
const AUTH_COOKIE_NAME = "neo_hire_token";

async function serverRequest<T>(path: string): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  const response = await fetch(`${BACKEND_API_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 401) {
      redirect("/login");
    }
    const detail = await response.text();
    throw new Error(detail || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getApplicationsServer(): Promise<JobApplication[]> {
  return serverRequest<JobApplication[]>("/api/applications");
}
