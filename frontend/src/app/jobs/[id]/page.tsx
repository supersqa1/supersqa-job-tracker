import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { GlassPane } from "@/components/ui/GlassPane";
import { NeoButton } from "@/components/ui/NeoButton";
import { StatusChip } from "@/components/ui/StatusChip";
import { getApplication } from "@/lib/api";
import { STATUS_CONFIG } from "@/lib/constants";
import { cn, formatRelativeDays, getInitials } from "@/lib/utils";
import { notFound } from "next/navigation";

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const applicationId = Number(id);

  if (Number.isNaN(applicationId)) {
    notFound();
  }

  let application;
  try {
    application = await getApplication(applicationId);
  } catch {
    notFound();
  }

  const statusConfig = STATUS_CONFIG[application.status];

  return (
    <AppShell>
      <div className="custom-scrollbar flex-1 overflow-y-auto px-margin-mobile py-6 md:px-margin-desktop md:py-8">
        <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <StatusChip
                className={cn("border", statusConfig.badgeClass)}
              >
                {statusConfig.label}
              </StatusChip>
              <span className="text-sm text-outline">ID: #{application.id}</span>
            </div>
            <h1 className="font-[family-name:var(--font-headline)] text-headline-lg-mobile md:text-headline-lg text-on-surface">
              {application.role_title}
            </h1>
            <div className="mt-1 text-lg font-medium text-primary-fixed-dim">
              {application.company_name}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/">
              <NeoButton variant="ghost">
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Back
              </NeoButton>
            </Link>
            <NeoButton>
              <span className="material-symbols-outlined text-[18px]">mail</span>
              Follow Up
            </NeoButton>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-8">
            <GlassPane className="p-6">
              <div className="mb-6 flex items-start gap-4">
                <div className="glass-floating relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded border border-white/10">
                  <span className="font-[family-name:var(--font-display)] font-bold text-primary-fixed-dim">
                    {getInitials(application.company_name)}
                  </span>
                  <div className="absolute inset-0 bg-white/10" />
                </div>
                <div className="flex-1">
                  <div className="mb-3 flex flex-wrap gap-2">
                    {application.remote_type && (
                      <StatusChip className="border-outline-variant bg-surface-container-low/50 text-on-surface-variant">
                        {application.remote_type.replace("_", "-")}
                      </StatusChip>
                    )}
                    {application.location && (
                      <StatusChip className="border-outline-variant bg-surface-container-low/50 text-on-surface-variant">
                        {application.location}
                      </StatusChip>
                    )}
                    {application.salary_range && (
                      <StatusChip className="border-secondary/40 bg-secondary/10 text-secondary">
                        {application.salary_range}
                      </StatusChip>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed text-on-surface-variant">
                    {application.description ??
                      "No job description captured yet. Add details to improve your prep workflow."}
                  </p>
                </div>
              </div>
            </GlassPane>

            <GlassPane className="p-6">
              <h2 className="mb-4 flex items-center gap-2 font-[family-name:var(--font-headline)] text-headline-md text-on-surface">
                <span className="material-symbols-outlined text-[20px] text-tertiary-fixed-dim">
                  edit_note
                </span>
                Tactical Notes
              </h2>
              {application.notes ? (
                <div className="border-l-2 border-primary-fixed-dim py-1 pl-4">
                  <p className="text-sm text-on-surface-variant">{application.notes}</p>
                </div>
              ) : (
                <p className="text-sm text-outline">No notes yet.</p>
              )}
            </GlassPane>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-4">
            <GlassPane className="p-6">
              <h3 className="mb-6 flex items-center gap-2 font-[family-name:var(--font-headline)] text-headline-md text-on-surface">
                <span className="material-symbols-outlined text-[20px] text-outline-variant">
                  route
                </span>
                Vector Pathway
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="font-[family-name:var(--font-label)] text-xs uppercase text-secondary">
                    Current Status
                  </div>
                  <div className="mt-1 font-[family-name:var(--font-mono-data)] text-[10px] text-outline">
                    {statusConfig.label.toUpperCase()}
                  </div>
                </div>
                {application.next_action && (
                  <div className="rounded border border-primary-fixed-dim/20 bg-surface-container-low/50 p-3">
                    <div className="font-[family-name:var(--font-label)] text-xs uppercase text-primary-fixed-dim">
                      {application.next_action}
                    </div>
                    <div className="mt-1 font-[family-name:var(--font-mono-data)] text-[10px] text-primary-fixed-dim/70">
                      {formatRelativeDays(application.next_action_at)}
                    </div>
                  </div>
                )}
                {application.applied_at && (
                  <div>
                    <div className="font-[family-name:var(--font-label)] text-xs uppercase text-secondary">
                      Application Submitted
                    </div>
                    <div className="mt-1 font-[family-name:var(--font-mono-data)] text-[10px] text-outline">
                      {formatRelativeDays(application.applied_at)}
                    </div>
                  </div>
                )}
              </div>
            </GlassPane>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
