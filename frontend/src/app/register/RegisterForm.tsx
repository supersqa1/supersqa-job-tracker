"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NeoButton } from "@/components/ui/NeoButton";

export function RegisterForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.status === 409) {
        setError("That username is already taken.");
        return;
      }

      if (!response.ok) {
        setError("Unable to create your account.");
        return;
      }

      router.replace("/");
      router.refresh();
    } catch {
      setError("Unable to reach the registration service.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col justify-center gap-5 p-8 md:p-10">
      <div>
        <h2 className="font-[family-name:var(--font-headline)] text-headline-md text-on-surface">
          Create account
        </h2>
        <p className="mt-2 text-sm text-on-surface-variant">
          Start tracking your own job search pipeline.
        </p>
      </div>

      <label className="grid gap-2">
        <span className="field-label">Username</span>
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="field-control"
          autoComplete="username"
          minLength={3}
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
          autoComplete="new-password"
          minLength={8}
          required
        />
      </label>

      <label className="grid gap-2">
        <span className="field-label">Confirm Password</span>
        <input
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="field-control"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </label>

      {error && (
        <p className="border border-error/30 bg-error-container/20 px-3 py-2 text-sm text-error">
          {error}
        </p>
      )}

      <NeoButton type="submit" disabled={isSubmitting} className="min-h-12">
        <span className="material-symbols-outlined text-[18px]">person_add</span>
        {isSubmitting ? "Creating account" : "Create account"}
      </NeoButton>

      <p className="text-center text-sm text-on-surface-variant">
        Already have an account?{" "}
        <Link href="/login" className="text-primary-fixed-dim hover:text-primary-fixed">
          Log in
        </Link>
      </p>
    </form>
  );
}
