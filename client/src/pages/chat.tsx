const conversation = [
  {
    sender: "Maya",
    time: "5:02 PM",
    message: "Hi Jordan! Happy to share water while you’re in town. How many liters do you need?",
    type: "received" as const,
  },
  {
    sender: "You",
    time: "5:05 PM",
    message: "Hi Maya! Thanks so much. 10 liters would be perfect. I’ll bring my own glass containers.",
    type: "sent" as const,
  },
  {
    sender: "Maya",
    time: "5:06 PM",
    message: "Great! I’ll have everything ready by 5:30 PM. Text me when you’re outside and I’ll meet you curbside.",
    type: "received" as const,
  },
];

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-16">
        <header className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">Chat</p>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Message with Maya</h1>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Usually replies in 10 minutes
            </div>
          </div>
          <p className="text-sm text-slate-500">
            Keep communication focused on pickup details. We never share your personal phone number.
          </p>
        </header>

        <div className="mt-8 flex flex-1 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
          <div className="flex-1 space-y-4 bg-[radial-gradient(circle_at_top,_#f8fafc,_white)] px-6 py-8">
            {conversation.map((entry) => (
              <div key={entry.time} className="space-y-1">
                <div className={`flex ${entry.type === "sent" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs rounded-3xl px-5 py-3 text-sm leading-relaxed shadow-sm sm:max-w-md ${
                      entry.type === "sent"
                        ? "rounded-tr-xl bg-slate-900 text-white"
                        : "rounded-tl-xl bg-slate-100 text-slate-900"
                    }`}
                  >
                    {entry.message}
                  </div>
                </div>
                <div className={`text-xs text-slate-400 ${entry.type === "sent" ? "text-right" : "text-left"}`}>
                  {entry.sender} · {entry.time}
                </div>
              </div>
            ))}
          </div>

          <form className="border-t border-slate-200 bg-white/70 px-6 py-4">
            <label className="sr-only" htmlFor="message">
              Message
            </label>
            <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
              <input
                id="message"
                type="text"
                placeholder="Type a message"
                className="flex-1 border-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              <button type="button" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800">
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
