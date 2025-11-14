import { useState } from "react";

const stars = [1, 2, 3, 4, 5];

export default function RateHostPage() {
  const [rating, setRating] = useState(5);
  const [hovered, setHovered] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xl shadow-slate-200/70">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">Rate host</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            How was your pickup with Maya?
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Your feedback keeps the community caring, generous, and aligned with Kangen best practices.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-8">
            <div className="flex justify-center gap-3">
              {stars.map((star) => {
                const isActive = (hovered ?? rating) >= star;
                return (
                  <button
                    type="button"
                    key={star}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => setRating(star)}
                    className={`h-14 w-14 rounded-full border transition ${
                      isActive
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-400 hover:border-slate-300"
                    }`}
                    aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                  >
                    <span className="text-2xl">★</span>
                  </button>
                );
              })}
            </div>

            <div className="text-left">
              <label htmlFor="feedback" className="text-sm font-medium text-slate-600">
                Additional comments (optional)
              </label>
              <textarea
                id="feedback"
                rows={4}
                placeholder="Share what stood out about your experience, timing, or water quality."
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-slate-900 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800"
            >
              Submit rating
            </button>

            {submitted && (
              <div className="rounded-2xl border border-slate-200 bg-slate-900/90 px-6 py-5 text-sm text-white shadow-lg">
                <p className="font-medium">Thanks for uplifting the community</p>
                <p className="mt-1 text-slate-200">
                  Your review helps other travelers trust Maya and keeps Kangen Share full of thoughtful hosts.
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
