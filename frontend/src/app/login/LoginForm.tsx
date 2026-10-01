"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { NeoButton } from "@/components/ui/NeoButton";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        setError("Invalid username or password.");
        return;
      }

      router.replace(searchParams.get("next") ?? "/");
      router.refresh();
    } catch {
      setError("Unable to reach the authentication service.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col justify-center gap-5 p-8 md:p-10">
      <div>
        <h2 className="font-[family-name:var(--font-headline)] text-headline-md text-on-surface">
          Log in
        </h2>
        <p className="mt-2 text-sm text-on-surface-variant">
          Use your configured admin credentials.
        </p>
      </div>

      <label className="grid gap-2">
        <span className="field-label">Username</span>
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="field-control"
          autoComplete="username"
          autoFocus
          required
        />
      </label>

      <label className="grid gap-2">
        <span className="field-label">Password</span>
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="field-control"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>

      {error && (
        <p className="border border-error/30 bg-error-container/20 px-3 py-2 text-sm text-error">
          {error}
        </p>
      )}

      <NeoButton type="submit" disabled={isSubmitting} className="min-h-12">
        <span className="material-symbols-outlined text-[18px]">login</span>
        {isSubmitting ? "Signing in" : "Sign in"}
      </NeoButton>

      <p className="text-center text-sm text-on-surface-variant">
        New to NEO-HIRE?{" "}
        <Link href="/register" className="text-primary-fixed-dim hover:text-primary-fixed">
          Create an account
        </Link>
      </p>
    </form>
  );
}
