"use client";

import { FormEvent, useMemo, useState } from "react";
import type {
  ApplicationStatus,
  JobApplication,
  JobApplicationCreate,
  RemoteType,
} from "@/lib/types";
import { KANBAN_STATUSES, STATUS_CONFIG } from "@/lib/constants";
import { NeoButton } from "@/components/ui/NeoButton";

type ApplicationFormState = Required<
  Pick<JobApplicationCreate, "company_name" | "role_title">
> &
  Omit<JobApplicationCreate, "company_name" | "role_title">;

interface ApplicationModalProps {
  application?: JobApplication | null;
  defaultStatus: ApplicationStatus;
  isSaving: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (payload: JobApplicationCreate) => Promise<void>;
}

const blankForm = (status: ApplicationStatus): ApplicationFormState => ({
  company_name: "",
  role_title: "",
  status,
  location: "",
  remote_type: null,
  salary_range: "",
  job_url: "",
  description: "",
  notes: "",
  next_action: "",
  next_action_at: "",
  applied_at: "",
});

function toDatetimeLocal(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 16);
}

function emptyToNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
}

export function ApplicationModal({
  application,
  defaultStatus,
  isSaving,
  error,
  onClose,
  onSubmit,
}: ApplicationModalProps) {
  const initialState = useMemo<ApplicationFormState>(() => {
    if (!application) return blankForm(defaultStatus);
    return {
      company_name: application.company_name,
      role_title: application.role_title,
      status: application.status,
      location: application.location ?? "",
      remote_type: application.remote_type,
      salary_range: application.salary_range ?? "",
      job_url: application.job_url ?? "",
      description: application.description ?? "",
      notes: application.notes ?? "",
      next_action: application.next_action ?? "",
      next_action_at: toDatetimeLocal(application.next_action_at),
      applied_at: toDatetimeLocal(application.applied_at),
    };
  }, [application, defaultStatus]);

  const [form, setForm] = useState<ApplicationFormState>(initialState);
  const title = application ? "Edit Application" : "New Application";

  function updateField<K extends keyof ApplicationFormState>(
    key: K,
    value: ApplicationFormState[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit({
      company_name: form.company_name.trim(),
      role_title: form.role_title.trim(),
      status: form.status,
      location: emptyToNull(form.location),
      remote_type: form.remote_type,
      salary_range: emptyToNull(form.salary_range),
      job_url: emptyToNull(form.job_url),
      description: emptyToNull(form.description),
      notes: emptyToNull(form.notes),
      next_action: emptyToNull(form.next_action),
      next_action_at: emptyToNull(form.next_action_at),
      applied_at: emptyToNull(form.applied_at),
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="application-modal-title"
    >
      <form
        onSubmit={handleSubmit}
        className="precision-border custom-scrollbar flex max-h-full w-full max-w-3xl flex-col overflow-y-auto rounded-lg border-outline-variant/40 bg-surface-container-high p-0 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-outline-variant/40 bg-surface-container-highest/50 p-6">
          <div>
            <h2
              id="application-modal-title"
              className="font-[family-name:var(--font-headline)] text-headline-lg-mobile text-on-surface"
            >
              {title}
            </h2>
            <p className="mt-1 font-[family-name:var(--font-mono-data)] text-xs uppercase tracking-widest text-outline-variant">
              Pipeline record
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center border border-outline-variant/30 text-outline-variant transition-colors hover:text-on-surface"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="space-y-5 p-6">
          {error && (
            <div className="border border-error/40 bg-error-container/25 p-3 text-sm text-error">
              {error}
            </div>
          )}

          <section className="rounded border border-outline-variant/35 bg-surface-container-low p-4">
            <h3 className="mb-4 font-[family-name:var(--font-headline)] text-base font-semibold text-on-surface">
              Job Details
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="field-label">Company</span>
                <input
                  required
                  value={form.company_name}
                  onChange={(event) =>
                    updateField("company_name", event.target.value)
                  }
                  className="field-control"
                  placeholder="Acme Corp"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="field-label">Role</span>
                <input
                  required
                  value={form.role_title}
                  onChange={(event) => updateField("role_title", event.target.value)}
                  className="field-control"
                  placeholder="Senior QA Engineer"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="field-label">Status</span>
                <span className="relative">
                  <select
                    value={form.status}
                    onChange={(event) =>
                      updateField("status", event.target.value as ApplicationStatus)
                    }
                    className="field-control field-select"
                  >
                    {KANBAN_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {STATUS_CONFIG[status].label}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-primary-fixed-dim">
                    expand_more
                  </span>
                </span>
              </label>
              <label className="flex flex-col gap-2">
                <span className="field-label">Work Mode</span>
                <span className="relative">
                  <select
                    value={form.remote_type ?? ""}
                    onChange={(event) =>
                      updateField(
                        "remote_type",
                        event.target.value
                          ? (event.target.value as RemoteType)
                          : null,
                      )
                    }
                    className="field-control field-select"
                  >
                    <option value="">Unspecified</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="on_site">On-site</option>
                  </select>
                  <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-primary-fixed-dim">
                    expand_more
                  </span>
                </span>
              </label>
              <label className="flex flex-col gap-2">
                <span className="field-label">Location</span>
                <input
                  value={form.location ?? ""}
                  onChange={(event) => updateField("location", event.target.value)}
                  className="field-control"
                  placeholder="Seattle, WA"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="field-label">Salary</span>
                <input
                  value={form.salary_range ?? ""}
                  onChange={(event) =>
                    updateField("salary_range", event.target.value)
                  }
                  className="field-control"
                  placeholder="$120k - $150k"
                />
              </label>
              <label className="flex flex-col gap-2 md:col-span-2">
                <span className="field-label">Job URL</span>
                <input
                  value={form.job_url ?? ""}
                  onChange={(event) => updateField("job_url", event.target.value)}
                  className="field-control"
                  type="url"
                  placeholder="https://..."
                />
              </label>
            </div>
          </section>

          <section className="rounded border border-outline-variant/35 bg-surface-container-low p-4">
            <h3 className="mb-4 font-[family-name:var(--font-headline)] text-base font-semibold text-on-surface">
              Follow Up
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="field-label">Next Action</span>
                <input
                  value={form.next_action ?? ""}
                  onChange={(event) =>
                    updateField("next_action", event.target.value)
                  }
                  className="field-control"
                  placeholder="Follow up with recruiter"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="field-label">Next Action Date</span>
                <input
                  value={form.next_action_at ?? ""}
                  onChange={(event) =>
                    updateField("next_action_at", event.target.value)
                  }
                  className="field-control"
                  type="datetime-local"
                />
              </label>
              <label className="flex flex-col gap-2 md:col-span-2">
                <span className="field-label">Notes</span>
                <textarea
                  value={form.notes ?? ""}
                  onChange={(event) => updateField("notes", event.target.value)}
                  className="field-control min-h-28 resize-y"
                  placeholder="Interview notes, contacts, compensation details, blockers..."
                />
              </label>
            </div>
          </section>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-outline-variant/40 bg-surface-container-highest/40 p-6 sm:flex-row sm:justify-end">
          <NeoButton type="button" variant="ghost" onClick={onClose}>
            Cancel
          </NeoButton>
          <NeoButton type="submit" disabled={isSaving}>
            <span className="material-symbols-outlined filled text-[18px]">
              {isSaving ? "sync" : "save"}
            </span>
            {isSaving ? "Saving" : "Save Application"}
          </NeoButton>
        </div>
      </form>
    </div>
  );
}
