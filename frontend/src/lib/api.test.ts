import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createApplication,
  deleteApplication,
  getApplications,
  getCurrentUser,
} from "./api";

describe("api client", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uses the authenticated same-origin proxy for list requests", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify([]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const applications = await getApplications({
      status: "applied",
      search: "qa engineer",
    });

    expect(applications).toEqual([]);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/backend/applications?status=applied&search=qa+engineer",
      expect.objectContaining({
        cache: "no-store",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      }),
    );
  });

  it("sends JSON payloads through the proxy for mutations", async () => {
    const payload = {
      company_name: "Acme",
      role_title: "QA Engineer",
      status: "applied" as const,
    };
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ id: 1, ...payload }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await createApplication(payload);

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/backend/applications",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(payload),
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      }),
    );
  });

  it("returns undefined for 204 delete responses", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 204 }));

    await expect(deleteApplication(1)).resolves.toBeUndefined();
  });

  it("requests the current user through the auth proxy", async () => {
    const user = { id: 1, username: "admin", is_active: true };
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(user), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await expect(getCurrentUser()).resolves.toEqual(user);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/backend/auth/me",
      expect.any(Object),
    );
  });
});
