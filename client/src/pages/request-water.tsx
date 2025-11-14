import { FormEvent, useState } from "react";

export default function RequestWaterPage() {
  const [liters, setLiters] = useState("10");
  const [time, setTime] = useState("17:30");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-xl shadow-slate-200/80">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">Request water</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Plan your pickup</h1>
              <p className="mt-2 text-sm text-slate-600">
                Let your host know how much water you need, when you will arrive, and any special notes for a smooth handoff.
              </p>
            </div>
            <div className="rounded-full bg-slate-100 px-5 py-2 text-sm font-medium text-slate-900">
              Host: Maya Chen
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 space-y-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-6 text-sm text-slate-500">
                Liters requested
                <select
                  value={liters}
                  onChange={(event) => setLiters(event.target.value)}
                  className="mt-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                >
                  <option value="5">5 L</option>
                  <option value="10">10 L</option>
                  <option value="15">15 L</option>
                  <option value="20">20 L</option>
                </select>
              </label>

              <label className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-6 text-sm text-slate-500">
                Preferred pickup time
                <input
                  type="time"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  className="mt-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </label>
            </div>

            <label className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-6 text-sm text-slate-500">
              Notes for your host (optional)
              <textarea
                rows={4}
                placeholder="Let Maya know if you’re arriving with containers, need assistance carrying water, or have timing constraints."
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
            </label>

            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/70 p-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-slate-900">You’ll receive a confirmation</p>
                <p className="text-sm text-slate-500">We’ll notify you once Maya accepts and share exact pickup instructions.</p>
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800"
              >
                Confirm request
              </button>
            </div>

            {submitted && (
              <div className="rounded-2xl border border-slate-200 bg-slate-900/90 px-6 py-5 text-sm text-white shadow-lg">
                <p className="font-medium">Request sent</p>
                <p className="mt-1 text-slate-200">
                  Maya will respond soon. Keep your phone nearby in case she messages with any follow-up questions.
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
