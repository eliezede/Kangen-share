import { FormEvent } from "react";
import { useLocation } from "wouter";

export default function LoginPage() {
  const [, navigate] = useLocation();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate("/home");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-24">
        <div className="mx-auto w-full max-w-lg rounded-3xl border border-slate-200 bg-white/80 p-12 shadow-2xl shadow-slate-200/60 backdrop-blur">
          <div className="mb-12 text-center">
            <span className="inline-flex items-center rounded-full bg-slate-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              Kangen Share
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Stay hydrated wherever you travel.
            </h1>
            <p className="mt-4 text-base text-slate-600">
              Sign in with your email to find generous Kangen K8 hosts ready to share fresh alkaline water when you arrive.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 text-left">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-base font-medium text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              Continue
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            By continuing, you agree to share your profile with potential hosts when you send a water request.
          </p>
        </div>
      </div>
    </div>
  );
}
