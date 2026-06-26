import type { JobApplication } from "@/lib/types";
import { AppShell } from "@/components/layout/AppShell";
import { DashboardWorkspace } from "@/components/applications/DashboardWorkspace";
import { getApplications } from "@/lib/api";

export default async function DashboardPage() {
  let applications: JobApplication[] = [];
  let error: string | null = null;

  try {
    applications = await getApplications();
  } catch (err) {
    error =
      err instanceof Error
        ? err.message
        : "Unable to reach the API. Start the backend on port 3050.";
  }

  return (
    <AppShell>
      {error ? (
        <div className="mx-margin-mobile mt-8 md:mx-margin-desktop glass-pane precision-border rounded-lg p-6 text-on-surface-variant">
          <p className="font-[family-name:var(--font-headline)] text-headline-md text-error">
            Backend unavailable
          </p>
          <p className="mt-2 text-sm">{error}</p>
          <p className="mt-4 font-[family-name:var(--font-mono-data)] text-xs text-outline">
            Run: cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 3050
          </p>
        </div>
      ) : (
        <DashboardWorkspace initialApplications={applications} />
      )}
    </AppShell>
  );
}
