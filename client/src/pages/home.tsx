import { useState } from "react";

const featuredHosts = [
  {
    name: "Maya Chen",
    city: "San Francisco, CA",
    rating: 4.9,
    ph: "8.5 - 9.5",
    availability: "Weekdays 7am - 9pm",
    maintenance: "Filter changed 2 weeks ago",
  },
  {
    name: "Jordan Blake",
    city: "Austin, TX",
    rating: 4.8,
    ph: "9.0",
    availability: "Daily 6am - 8pm",
    maintenance: "Full system flush last month",
  },
  {
    name: "Sofia Martinez",
    city: "New York, NY",
    rating: 5.0,
    ph: "8.5 - 9.5",
    availability: "Weekends",
    maintenance: "Electrodes inspected this week",
  },
];

const mapPins = [
  { top: "20%", left: "30%", label: "Maya" },
  { top: "60%", left: "45%", label: "Jordan" },
  { top: "35%", left: "72%", label: "Sofia" },
  { top: "48%", left: "18%", label: "Ava" },
  { top: "72%", left: "64%", label: "Noah" },
];

export default function HomePage() {
  const [search, setSearch] = useState("");

  const filteredHosts = featuredHosts.filter((host) =>
    `${host.name} ${host.city}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_#f8fafc,_rgba(248,250,252,0))]" />
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 pb-16 pt-24 lg:flex-row lg:items-center">
          <div className="w-full lg:w-2/5">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">
              Kangen Share
            </p>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Find alkaline water wherever you land.
            </h1>
            <p className="mt-4 text-base text-slate-600">
              Browse trusted Kangen K8 hosts, connect instantly, and pick up perfectly balanced water that keeps your wellness routine uninterrupted on the road.
            </p>
            <div className="mt-8 flex gap-4">
              <button className="rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800">
                Become a host
              </button>
              <button className="rounded-full border border-slate-200 px-6 py-3 text-sm font-medium text-slate-900 transition hover:border-slate-300 hover:bg-slate-100">
                Learn more
              </button>
            </div>
          </div>

          <div className="w-full rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/70 backdrop-blur lg:w-3/5">
            <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 shadow-sm focus-within:border-slate-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-5 w-5 text-slate-400"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="search"
                placeholder="Search by city, host, or pH preference"
                className="w-full border-none bg-transparent text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="relative h-72 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-6 text-white">
                <div className="absolute inset-0 opacity-70" style={{ backgroundImage: "url('https://maps.gstatic.com/tactile/pane/default_geography.png')", backgroundSize: "cover" }} />
                <div className="relative h-full w-full rounded-2xl bg-white/5 backdrop-blur">
                  {mapPins.map((pin) => (
                    <div
                      key={pin.label}
                      className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
                      style={{ top: pin.top, left: pin.left }}
                    >
                      <div className="mx-auto h-3 w-3 rounded-full bg-white" />
                      <div className="mt-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-900 shadow-lg shadow-slate-900/10">
                        {pin.label}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="absolute left-6 top-6 rounded-full bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-wide">
                  Live hosts near you
                </div>
              </div>

              <div className="space-y-4">
                {filteredHosts.map((host) => (
                  <article
                    key={host.name}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70 transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{host.name}</h3>
                        <p className="text-sm text-slate-500">{host.city}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-medium text-slate-900">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-amber-400">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.034a1 1 0 00-1.175 0l-2.802 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {host.rating}
                      </div>
                    </div>
                    <dl className="mt-4 grid grid-cols-2 gap-4 text-sm text-slate-600">
                      <div>
                        <dt className="font-medium text-slate-500">pH available</dt>
                        <dd className="text-slate-900">{host.ph}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-slate-500">Availability</dt>
                        <dd className="text-slate-900">{host.availability}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-slate-500">Maintenance</dt>
                        <dd className="text-slate-900">{host.maintenance}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-slate-500">Response time</dt>
                        <dd className="text-slate-900">Usually within 15 minutes</dd>
                      </div>
                    </dl>
                    <button className="mt-6 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-sm shadow-slate-900/20 transition hover:bg-slate-800">
                      View profile
                    </button>
                  </article>
                ))}
                {filteredHosts.length === 0 && (
                  <p className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500">
                    No hosts match your search yet. Try another city or adjust your filters.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
