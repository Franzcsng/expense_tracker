import { LoginForm } from "./components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-zinc-100">Welcome back</h1>
          <p className="mt-1 text-sm text-zinc-500">Sign in to your account</p>
        </div>
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
