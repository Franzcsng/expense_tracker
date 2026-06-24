"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function SignUpForm() {
  const router = useRouter();

  const [error, action, pending] = useActionState(async (_prev: string, formData: FormData) => {
    const first_name = formData.get("firstName") as string;
    const last_name = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ first_name, last_name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) return data.error ?? "Sign up failed";

    router.push("/login");
    return "";
  }, "");

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-300">First name</label>
          <input
            name="firstName"
            type="text"
            required
            placeholder="John"
            className="rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-300">Last name</label>
          <input
            name="lastName"
            type="text"
            required
            placeholder="Doe"
            className="rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-300">Email</label>
        <input
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-300">Password</label>
        <input
          name="password"
          type="password"
          required
          placeholder="••••••••"
          className="rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2.5 text-sm font-semibold text-white transition"
      >
        {pending ? "Creating account…" : "Create account"}
      </button>

      <p className="text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link href="/login" className="text-indigo-400 hover:text-indigo-300 transition">
          Sign in
        </Link>
      </p>
    </form>
  );
}
