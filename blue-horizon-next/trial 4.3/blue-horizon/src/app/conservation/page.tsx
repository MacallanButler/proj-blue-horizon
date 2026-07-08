"use client";

import { useState } from "react";

const orgs = [
  {
    name: "PADI AWARE Foundation",
    tags: ["Cleanup", "Research", "Education"],
    focus: "Citizen science & ocean action",
    description: "The non-profit arm of PADI. Runs Dive Against Debris, coral reef conservation courses, and a global conservation activity locator.",
    url: "https://www.padi.com/aware",
    region: "Global",
  },
  {
    name: "Coral Restoration Foundation",
    tags: ["Coral", "Research"],
    focus: "Coral reef restoration",
    description: "World's largest coral-focused nonprofit. Cultivates and outplants reef-building corals at scale, with hands-on dive programs open to the public.",
    url: "https://coralrestoration.org",
    region: "Florida / Global",
  },
  {
    name: "Reef Check",
    tags: ["Research", "Education"],
    focus: "Global reef health monitoring",
    description: "Trains volunteer divers to survey reef health using standardized scientific protocols, generating data used by marine managers worldwide.",
    url: "https://www.reefcheck.org",
    region: "Global",
  },
  {
    name: "Ocean Conservancy",
    tags: ["Cleanup", "Policy"],
    focus: "Science-based ocean advocacy",
    description: "Focuses on marine pollution, overfishing, and climate policy. Organizes the International Coastal Cleanup — the world's largest volunteer effort.",
    url: "https://oceanconservancy.org",
    region: "Global",
  },
  {
    name: "REEF — Reef Environmental Education Foundation",
    tags: ["Research", "Education"],
    focus: "Volunteer fish surveys",
    description: "Partners with dive shops to run volunteer fish surveys. Conservation Partners receive tools and recognition for active reef stewardship.",
    url: "https://www.reef.org",
    region: "Americas",
  },
  {
    name: "Coral Reef Alliance",
    tags: ["Coral", "Policy", "Research"],
    focus: "Reef resilience & community stewardship",
    description: "Works with local communities, scientists, and dive clubs to reduce threats and strengthen reef resilience through locally-rooted engagement.",
    url: "https://coral.org",
    region: "Global",
  },
];

const events = [
  {
    title: "Dive Against Debris",
    type: "Cleanup",
    date: "2025-04-12",
    displayDate: "Apr 12",
    day: "Sat",
    time: "8:00 AM",
    spots: 12,
    filled: 7,
    description: "Collect and log underwater debris at Blue Horizon's adopted site. Data submitted to the PADI AWARE global database.",
    difficulty: "Open Water+",
  },
  {
    title: "Coral Awareness Seminar",
    type: "Education",
    date: "2025-04-19",
    displayDate: "Apr 19",
    day: "Sat",
    time: "10:00 AM",
    spots: 20,
    filled: 11,
    description: "Shore-based seminar on coral identification, bleaching indicators, and how to report health data on your dives.",
    difficulty: "All levels",
  },
  {
    title: "Reef Check Survey Dive",
    type: "Research",
    date: "2025-05-03",
    displayDate: "May 3",
    day: "Sat",
    time: "7:30 AM",
    spots: 8,
    filled: 3,
    description: "Certified Reef Check survey using standardized transect protocols. Training provided the evening before.",
    difficulty: "Advanced+",
  },
  {
    title: "Dive Against Debris",
    type: "Cleanup",
    date: "2025-05-10",
    displayDate: "May 10",
    day: "Sat",
    time: "8:00 AM",
    spots: 12,
    filled: 2,
    description: "Monthly debris collection and logging at the main reef site. All gear provided.",
    difficulty: "Open Water+",
  },
  {
    title: "Night Coral Spawn Watch",
    type: "Research",
    date: "2025-05-17",
    displayDate: "May 17",
    day: "Sat",
    time: "9:00 PM",
    spots: 6,
    filled: 6,
    description: "Rare opportunity to observe coral spawning in situ. In partnership with CORAL. Fully booked — join the waitlist.",
    difficulty: "Advanced+",
  },
  {
    title: "Beach & Shore Cleanup",
    type: "Cleanup",
    date: "2025-06-07",
    displayDate: "Jun 7",
    day: "Sat",
    time: "9:00 AM",
    spots: 30,
    filled: 8,
    description: "No certification needed. Shoreline cleanup logging debris for Ocean Conservancy's International Coastal Cleanup database.",
    difficulty: "All levels",
  },
];

const ALL_TAGS = ["All", "Coral", "Cleanup", "Research", "Education", "Policy"];

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  Cleanup: { bg: "bg-teal-900/40", text: "text-teal-300" },
  Research: { bg: "bg-blue-900/40", text: "text-blue-300" },
  Education: { bg: "bg-amber-900/40", text: "text-amber-300" },
  Policy: { bg: "bg-violet-900/40", text: "text-violet-300" },
  Coral: { bg: "bg-rose-900/40", text: "text-rose-300" },
};

// ── RSVP Modal ──────────────────────────────────────────────────────────────
function RSVPModal({
  event,
  onClose,
}: {
  event: typeof events[0];
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const isFull = event.filled >= event.spots;
  const isWaitlist = isFull;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-700/40">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-cyan-400 text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ fontFamily: "system-ui, sans-serif" }}>
                {isWaitlist ? "Join Waitlist" : "RSVP"}
              </p>
              <h2 className="text-white font-bold text-xl leading-tight">{event.title}</h2>
              <p className="text-slate-400 text-sm mt-1" style={{ fontFamily: "system-ui, sans-serif" }}>
                {event.displayDate} · {event.time} · {event.difficulty}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-white transition-colors mt-1 shrink-0"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">
                {isWaitlist ? "You're on the waitlist!" : "You're registered!"}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed" style={{ fontFamily: "system-ui, sans-serif" }}>
                We'll send a confirmation to <span className="text-white">{email}</span>. See you on{" "}
                <span className="text-white">{event.displayDate}</span>.
              </p>
              <button
                onClick={onClose}
                className="mt-6 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                style={{ fontFamily: "system-ui, sans-serif" }}
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {isWaitlist && (
                <p className="text-amber-400/80 text-xs rounded-lg bg-amber-900/20 border border-amber-500/20 px-3 py-2" style={{ fontFamily: "system-ui, sans-serif" }}>
                  This event is full. We'll contact you if a spot opens up.
                </p>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5" style={{ fontFamily: "system-ui, sans-serif" }}>
                  Full name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your name"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 h-11 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 transition-colors"
                  style={{ fontFamily: "system-ui, sans-serif" }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5" style={{ fontFamily: "system-ui, sans-serif" }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 h-11 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 transition-colors"
                  style={{ fontFamily: "system-ui, sans-serif" }}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-cyan-400 text-slate-900 font-bold text-sm py-3 rounded-full hover:bg-cyan-300 transition-colors duration-200 mt-2"
                style={{ fontFamily: "system-ui, sans-serif" }}
              >
                {isWaitlist ? "Join Waitlist →" : "Confirm RSVP →"}
              </button>

              <p className="text-center text-[11px] text-slate-600" style={{ fontFamily: "system-ui, sans-serif" }}>
                No spam. Just a confirmation and reminder before the event.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Tag Pill ─────────────────────────────────────────────────────────────────
function TagPill({ tag, active, onClick }: { tag: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{ fontFamily: "system-ui, sans-serif" }}
      className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-200 border ${
        active
          ? "bg-cyan-400 text-slate-900 border-cyan-400"
          : "bg-transparent text-slate-400 border-slate-600 hover:border-slate-400 hover:text-slate-200"
      }`}
    >
      {tag}
    </button>
  );
}

// ── Org Card ──────────────────────────────────────────────────────────────────
function OrgCard({ org }: { org: typeof orgs[0] }) {
  return (
    <div className="group relative bg-slate-800/50 border border-slate-700/60 rounded-2xl p-6 flex flex-col gap-3 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all duration-300">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-white font-semibold text-base leading-tight">{org.name}</h3>
        <span className="text-slate-500 text-[10px] uppercase tracking-widest whitespace-nowrap mt-0.5" style={{ fontFamily: "system-ui, sans-serif" }}>
          {org.region}
        </span>
      </div>
      <p className="text-cyan-400 text-xs font-medium uppercase tracking-wider" style={{ fontFamily: "system-ui, sans-serif" }}>{org.focus}</p>
      <p className="text-slate-400 text-sm leading-relaxed" style={{ fontFamily: "system-ui, sans-serif" }}>{org.description}</p>
      <div className="flex flex-wrap gap-1.5 mt-1">
        {org.tags.map((t) => {
          const c = TYPE_COLORS[t] || { bg: "bg-slate-700", text: "text-slate-300" };
          return (
            <span key={t} className={`${c.bg} ${c.text} text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider`} style={{ fontFamily: "system-ui, sans-serif" }}>
              {t}
            </span>
          );
        })}
      </div>
      <a
        href={org.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto pt-2 text-xs text-slate-500 hover:text-cyan-400 transition-colors duration-200 flex items-center gap-1.5 group-hover:text-cyan-400"
        style={{ fontFamily: "system-ui, sans-serif" }}
      >
        Visit {org.name.split(" ")[0]}
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  );
}

// ── Event Card ────────────────────────────────────────────────────────────────
function EventCard({ event, onRSVP }: { event: typeof events[0]; onRSVP: (event: typeof events[0]) => void }) {
  const c = TYPE_COLORS[event.type] || TYPE_COLORS.Cleanup;
  const isFull = event.filled >= event.spots;
  const pct = Math.round((event.filled / event.spots) * 100);
  const monthNum = event.displayDate.split(" ")[1];

  return (
    <div className={`relative bg-slate-800/50 border rounded-2xl overflow-hidden transition-all duration-300 ${isFull ? "border-slate-700/40 opacity-75" : "border-slate-700/60 hover:border-cyan-500/40 hover:bg-slate-800/80"}`}>
      <div className="flex">
        {/* Date column */}
        <div className="flex flex-col items-center justify-center px-5 py-6 bg-slate-900/60 border-r border-slate-700/60 min-w-[72px]">
          <span className="text-slate-500 text-[10px] uppercase tracking-widest font-semibold" style={{ fontFamily: "system-ui, sans-serif" }}>{event.day}</span>
          <span className="text-white text-2xl font-bold leading-none mt-0.5">{monthNum}</span>
          <span className="text-slate-400 text-xs mt-0.5" style={{ fontFamily: "system-ui, sans-serif" }}>{event.displayDate.split(" ")[0]}</span>
        </div>

        {/* Content */}
        <div className="flex-1 px-5 py-4 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-white font-semibold text-sm leading-snug">{event.title}</h3>
            <span className={`${c.bg} ${c.text} text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap`} style={{ fontFamily: "system-ui, sans-serif" }}>
              {event.type}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500" style={{ fontFamily: "system-ui, sans-serif" }}>
            <span>{event.time}</span>
            <span>·</span>
            <span>{event.difficulty}</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed" style={{ fontFamily: "system-ui, sans-serif" }}>{event.description}</p>

          {/* Capacity bar */}
          <div className="mt-1 flex items-center gap-2">
            <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${isFull ? "bg-slate-500" : "bg-cyan-400"}`} style={{ width: `${pct}%` }} />
            </div>
            <span className={`text-[10px] font-semibold ${isFull ? "text-slate-500" : "text-slate-400"}`} style={{ fontFamily: "system-ui, sans-serif" }}>
              {isFull ? "Full" : `${event.spots - event.filled} spots left`}
            </span>
          </div>

          <button
            onClick={() => onRSVP(event)}
            className={`mt-1 self-start text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-200 ${
              isFull
                ? "bg-slate-700/60 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                : "bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 hover:bg-cyan-400 hover:text-slate-900"
            }`}
            style={{ fontFamily: "system-ui, sans-serif" }}
          >
            {isFull ? "Join Waitlist →" : "Register →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ConservationPage() {
  const [activeTag, setActiveTag] = useState("All");
  const [rsvpEvent, setRsvpEvent] = useState<typeof events[0] | null>(null);

  const filteredOrgs = activeTag === "All" ? orgs : orgs.filter((o) => o.tags.includes(activeTag));

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background: "linear-gradient(160deg, #020d18 0%, #041824 40%, #020d18 100%)",
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(100,220,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(100,220,255,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* RSVP Modal */}
      {rsvpEvent && <RSVPModal event={rsvpEvent} onClose={() => setRsvpEvent(null)} />}

      <div className="relative max-w-6xl mx-auto px-6 py-20">

        {/* Hero */}
        <div className="mb-20">
          <p className="text-cyan-400 text-xs uppercase tracking-[0.3em] font-semibold mb-4" style={{ fontFamily: "system-ui, sans-serif" }}>
            Blue Horizon Dive Shop
          </p>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6" style={{ letterSpacing: "-0.02em" }}>
            Protect What<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg, #22d3ee, #0ea5e9)" }}>
              You Explore
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl leading-relaxed" style={{ fontFamily: "system-ui, sans-serif" }}>
            Every dive is a chance to give back. Below you'll find the organizations doing the most meaningful work in ocean conservation — and the events we host so you can be part of it.
          </p>
        </div>

        {/* Org directory */}
        <section className="mb-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Conservation Partners</h2>
              <p className="text-slate-500 text-sm" style={{ fontFamily: "system-ui, sans-serif" }}>Organizations we trust and actively support.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {ALL_TAGS.map((tag) => (
                <TagPill key={tag} tag={tag} active={activeTag === tag} onClick={() => setActiveTag(tag)} />
              ))}
            </div>
          </div>

          {filteredOrgs.length === 0 ? (
            <p className="text-slate-500 text-sm py-8" style={{ fontFamily: "system-ui, sans-serif" }}>No organizations match that filter.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrgs.map((org) => <OrgCard key={org.name} org={org} />)}
            </div>
          )}
        </section>

        {/* Events */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-1">Upcoming Events</h2>
            <p className="text-slate-500 text-sm" style={{ fontFamily: "system-ui, sans-serif" }}>
              Shop-hosted conservation dives, cleanups, and seminars. Open to all certified divers unless noted.
            </p>
          </div>

          {["Apr", "May", "Jun"].map((month) => {
            const monthEvents = events.filter((e) => e.displayDate.startsWith(month));
            if (!monthEvents.length) return null;
            return (
              <div key={month} className="mb-10">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-slate-600 text-xs uppercase tracking-[0.2em] font-semibold" style={{ fontFamily: "system-ui, sans-serif" }}>
                    {month} 2025
                  </span>
                  <div className="flex-1 h-px bg-slate-800" />
                </div>
                <div className="flex flex-col gap-3">
                  {monthEvents.map((event) => (
                    <EventCard key={event.title + event.date} event={event} onRSVP={setRsvpEvent} />
                  ))}
                </div>
              </div>
            );
          })}

          <div className="mt-12 rounded-2xl border border-cyan-500/20 bg-cyan-950/20 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-white font-semibold text-lg mb-1">Want to host or suggest an event?</h3>
              <p className="text-slate-400 text-sm" style={{ fontFamily: "system-ui, sans-serif" }}>
                We're always looking to partner with local orgs, dive clubs, and marine researchers.
              </p>
            </div>
            <button
              className="shrink-0 bg-cyan-400 text-slate-900 font-bold text-sm px-6 py-3 rounded-full hover:bg-cyan-300 transition-colors duration-200"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              Get in touch →
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
