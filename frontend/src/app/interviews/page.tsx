import { AppShell } from "@/components/layout/AppShell";
import { GlassPane } from "@/components/ui/GlassPane";

export default function InterviewsPage() {
  return (
    <AppShell>
      <div className="flex flex-1 items-center justify-center px-margin-mobile md:px-margin-desktop">
        <GlassPane className="max-w-lg p-8 text-center">
          <span className="material-symbols-outlined mb-4 text-[40px] text-tertiary-fixed-dim">
            event_upcoming
          </span>
          <h1 className="font-[family-name:var(--font-headline)] text-headline-md text-on-surface">
            Interviews
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            Interview schedule and prep tools — scaffolded for a future sprint.
          </p>
        </GlassPane>
      </div>
    </AppShell>
  );
}
