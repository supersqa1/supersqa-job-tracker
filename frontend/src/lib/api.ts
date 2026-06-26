import type {
  ApplicationStatus,
  JobApplication,
  JobApplicationCreate,
  PipelineSummary,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3050";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function getApplications(params?: {
  status?: ApplicationStatus;
  search?: string;
}): Promise<JobApplication[]> {
  const query = new URLSearchParams();
  if (params?.status) query.set("status", params.status);
  if (params?.search) query.set("search", params.search);
  const suffix = query.toString() ? `?${query.toString()}` : "";
  return request<JobApplication[]>(`/api/applications${suffix}`);
}

export function getPipelineSummary(): Promise<PipelineSummary> {
  return request<PipelineSummary>("/api/applications/summary");
}

export function getApplication(id: number): Promise<JobApplication> {
  return request<JobApplication>(`/api/applications/${id}`);
}

export function createApplication(
  payload: JobApplicationCreate,
): Promise<JobApplication> {
  return request<JobApplication>("/api/applications", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateApplication(
  id: number,
  payload: Partial<JobApplicationCreate>,
): Promise<JobApplication> {
  return request<JobApplication>(`/api/applications/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteApplication(id: number): Promise<void> {
  return request<void>(`/api/applications/${id}`, { method: "DELETE" });
}
