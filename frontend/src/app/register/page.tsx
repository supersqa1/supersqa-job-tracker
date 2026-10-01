import { RegisterForm } from "./RegisterForm";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-surface-container-high/70 via-background to-background px-margin-mobile py-10 md:px-margin-desktop">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-outline-variant/30 bg-surface-container-low/80 shadow-[0_0_40px_rgba(0,242,255,0.12)] backdrop-blur-xl md:grid-cols-[1.05fr_0.95fr]">
        <div className="flex min-h-[520px] flex-col justify-between border-b border-outline-variant/20 p-8 md:border-b-0 md:border-r md:p-10">
          <div>
            <p className="font-[family-name:var(--font-mono-data)] text-xs uppercase tracking-widest text-primary-fixed-dim">
              Personal Pipeline
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-headline)] text-headline-lg-mobile text-on-surface md:text-headline-lg">
              NEO-HIRE
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-on-surface-variant">
              Create a private workspace for your applications, interviews, notes,
              and next steps.
            </p>
          </div>
          <div className="grid gap-3 font-[family-name:var(--font-mono-data)] text-xs uppercase tracking-widest text-outline">
            <div className="flex items-center gap-3 border-l-2 border-primary-fixed-dim/70 pl-3">
              <span className="material-symbols-outlined text-[18px] text-primary-fixed-dim">
                account_circle
              </span>
              Your workspace
            </div>
            <div className="flex items-center gap-3 border-l-2 border-secondary/70 pl-3">
              <span className="material-symbols-outlined text-[18px] text-secondary">
                work
              </span>
              Your applications
            </div>
          </div>
        </div>

        <RegisterForm />
      </section>
    </main>
  );
}
