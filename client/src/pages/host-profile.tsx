const host = {
  name: "Maya Chen",
  city: "San Francisco, California",
  rating: 4.9,
  reviews: 126,
  ph: "8.5 - 9.5",
  availability: "Weekdays 7am - 9pm",
  maintenance: "Filter replaced two weeks ago, deep clean monthly",
  bio: "Certified wellness coach, longtime Kangen advocate, and happy to help fellow travelers stay energized while they explore the Bay Area.",
};

const highlights = [
  "Complimentary refill bottles available",
  "15-minute pickup window with curbside handoff",
  "TDS and ORP logs updated daily",
  "Dedicated counter space for travelers to set up",
];

export default function HostProfilePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-12 shadow-xl shadow-slate-200/70">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.08),_transparent)]" />
          <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
            <div className="lg:w-2/3">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">Host profile</p>
                  <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{host.name}</h1>
                  <p className="text-sm text-slate-500">{host.city}</p>
                </div>
                <div className="rounded-full bg-slate-100 px-5 py-2 text-sm font-medium text-slate-900">
                  ★ {host.rating} · {host.reviews} reviews
                </div>
              </div>

              <p className="mt-6 text-base leading-relaxed text-slate-600">{host.bio}</p>

              <dl className="mt-10 grid gap-6 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-6">
                  <dt className="text-sm font-medium uppercase tracking-wide text-slate-500">pH available</dt>
                  <dd className="mt-2 text-lg font-semibold text-slate-900">{host.ph}</dd>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-6">
                  <dt className="text-sm font-medium uppercase tracking-wide text-slate-500">Availability</dt>
                  <dd className="mt-2 text-lg font-semibold text-slate-900">{host.availability}</dd>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-6 sm:col-span-2">
                  <dt className="text-sm font-medium uppercase tracking-wide text-slate-500">Maintenance</dt>
                  <dd className="mt-2 text-lg font-semibold text-slate-900">{host.maintenance}</dd>
                </div>
              </dl>

              <div className="mt-10">
                <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Pickup experience</h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/60 px-4 py-3 text-sm text-slate-600"
                    >
                      <span className="mt-1 inline-flex h-2.5 w-2.5 flex-none rounded-full bg-slate-900" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <aside className="lg:w-1/3">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Request water</p>
                <p className="mt-4 text-sm text-slate-600">
                  Maya typically responds within 10 minutes and prefers requests at least 2 hours before pickup.
                </p>
                <div className="mt-6 space-y-4 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Estimated pickup window</span>
                    <span className="font-medium text-slate-900">Today · 5:30 – 6:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Available volume</span>
                    <span className="font-medium text-slate-900">Up to 20 L</span>
                  </div>
                </div>
                <button className="mt-8 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800">
                  Request water
                </button>
                <p className="mt-4 text-xs text-slate-400">
                  Sharing is free. Hosts may suggest a gratitude tip to support maintenance.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
