"use client";

import { useState, useEffect } from "react";
import { Check, ShieldAlert, Award, CalendarDays, MapPin, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { apiClient } from "@/lib/apiClient";

const orgs = [
  {
    name: "PADI AWARE Foundation",
    tags: ["Cleanup", "Research", "Education"],
    focus: "Citizen science & ocean action",
    description:
      "The non-profit arm of PADI. Runs Dive Against Debris, coral reef conservation courses, and a global conservation activity locator.",
    url: "https://www.padi.com/aware",
    region: "Global",
  },
  {
    name: "Coral Restoration Foundation",
    tags: ["Coral", "Research"],
    focus: "Coral reef restoration",
    description:
      "World's largest coral-focused nonprofit. Cultivates and outplants reef-building corals at scale, with hands-on dive programs open to the public.",
    url: "https://coralrestoration.org",
    region: "Florida / Global",
  },
  {
    name: "Reef Check",
    tags: ["Research", "Education"],
    focus: "Global reef health monitoring",
    description:
      "Trains volunteer divers to survey reef health using standardized scientific protocols, generating data used by marine managers worldwide.",
    url: "https://www.reefcheck.org",
    region: "Global",
  },
  {
    name: "Ocean Conservancy",
    tags: ["Cleanup", "Policy"],
    focus: "Science-based ocean advocacy",
    description:
      "Focuses on marine pollution, overfishing, and climate policy. Organizes the International Coastal Cleanup — the world's largest volunteer effort.",
    url: "https://oceanconservancy.org",
    region: "Global",
  },
  {
    name: "REEF — Reef Environmental Education Foundation",
    tags: ["Research", "Education"],
    focus: "Volunteer fish surveys",
    description:
      "Partners with dive shops to run volunteer fish surveys. Conservation Partners receive tools and recognition for active reef stewardship.",
    url: "https://www.reef.org",
    region: "Americas",
  },
  {
    name: "Coral Reef Alliance",
    tags: ["Coral", "Policy", "Research"],
    focus: "Reef resilience & community stewardship",
    description:
      "Works with local communities, scientists, and dive clubs to reduce threats and strengthen reef resilience through locally-rooted engagement.",
    url: "https://coral.org",
    region: "Global",
  },
];

const ALL_TAGS = ["All", "Cleanup", "Coral", "Research", "Education", "Policy"];

const TIER_META: Record<string, { label: string; accent: string; description: string }> = {
  Beginner: {
    label: "Beginner",
    accent: "text-emerald-400",
    description: "Start here — no experience required.",
  },
  Continuing: {
    label: "Continuing Education",
    accent: "text-cyan-400",
    description: "Expand your limits and learn specialized skills.",
  },
  Professional: {
    label: "Professional",
    accent: "text-indigo-400",
    description: "Start leading others and turn diving into a career.",
  },
};

function TagPill({ tag, active, onClick }: { tag: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-250 border ${
        active
          ? "bg-cyan-400 text-slate-900 border-cyan-400"
          : "bg-transparent text-slate-400 border-slate-700/60 hover:border-slate-500 hover:text-slate-300"
      }`}
      style={{ fontFamily: "system-ui, sans-serif" }}
    >
      {tag}
    </button>
  );
}

function OrgCard({ org }: { org: typeof orgs[0] }) {
  return (
    <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-6 flex flex-col justify-between hover:border-cyan-500/20 transition-all duration-300">
      <div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {org.tags.map((t) => (
            <span
              key={t}
              className="text-[9px] font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-500/25 px-2 py-0.5 rounded-full uppercase tracking-wider"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              {t}
            </span>
          ))}
        </div>
        <h3 className="text-white font-bold text-lg mb-1">{org.name}</h3>
        <span
          className="text-slate-500 text-[10px] uppercase tracking-widest font-semibold block mb-4"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          Focus: {org.focus}
        </span>
        <p
          className="text-slate-400 text-sm leading-relaxed mb-6"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          {org.description}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 mt-auto">
        <span className="text-slate-500 text-xs" style={{ fontFamily: "system-ui, sans-serif" }}>
          📍 {org.region}
        </span>
        <a
          href={org.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          Website ↗
        </a>
      </div>
    </div>
  );
}

function EventCard({
  event,
  user,
  onRegisterSuccess,
}: {
  event: any;
  user: any;
  onRegisterSuccess: (title: string, date: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [certLevel, setCertLevel] = useState("Open Water");
  const [certNumber, setCertNumber] = useState("");
  const [conductCheck, setConductCheck] = useState(false);
  const [waiverCheck, setWaiverCheck] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setCertNumber(user.padiCertNumber || "");
      if (user.padiCertLevel) {
        setCertLevel(user.padiCertLevel.replace("_", " "));
      }
    }
  }, [user]);

  const isFull = event.filled >= event.spots;
  const pct = Math.min(100, (event.filled / event.spots) * 100);

  const colors = {
    Cleanup: { bg: "bg-teal-950/40 border-teal-500/25", text: "text-teal-400" },
    Education: { bg: "bg-amber-950/40 border-amber-500/25", text: "text-amber-400" },
    Research: { bg: "bg-indigo-950/40 border-indigo-500/25", text: "text-indigo-400" },
  };
  const c = colors[event.type as keyof typeof colors] || colors.Cleanup;
  const monthNum = event.displayDate.split(" ")[1];

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await apiClient.createRsvp({
        conservation_event_id: event.id,
        guest_name: name,
        guest_email: email,
      });

      setIsRegistered(true);
      onRegisterSuccess(event.title, event.date);
    } catch (err: any) {
      setError(err.message || "Failed to submit RSVP registration.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIsOpen(false);
    setIsRegistered(false);
    setError("");
    if (!user) {
      setName("");
      setEmail("");
      setCertLevel("Open Water");
      setCertNumber("");
    }
    setConductCheck(false);
    setWaiverCheck(false);
  };

  return (
    <div
      className={`relative bg-slate-800/50 border rounded-2xl overflow-hidden transition-all duration-300 ${
        isFull
          ? "border-slate-700/40 opacity-70"
          : "border-slate-700/60 hover:border-cyan-500/40 hover:bg-slate-800/80"
      }`}
    >
      <div className="flex">
        {/* Date column */}
        <div className="flex flex-col items-center justify-center px-5 py-6 bg-slate-900/60 border-r border-slate-700/60 min-w-[72px]">
          <span className="text-slate-500 text-[10px] uppercase tracking-widest font-semibold" style={{ fontFamily: "system-ui, sans-serif" }}>
            {event.day}
          </span>
          <span className="text-white text-2xl font-bold leading-none mt-0.5">{monthNum}</span>
          <span className="text-slate-400 text-xs mt-0.5" style={{ fontFamily: "system-ui, sans-serif" }}>
            {event.displayDate.split(" ")[0]}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 px-5 py-4 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-white font-semibold text-sm leading-snug">{event.title}</h3>
            <span
              className={`${c.bg} ${c.text} text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap`}
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              {event.type}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500" style={{ fontFamily: "system-ui, sans-serif" }}>
            <span>{event.time}</span>
            <span>·</span>
            <span>{event.difficulty}</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed" style={{ fontFamily: "system-ui, sans-serif" }}>
            {event.description}
          </p>
          
          {/* Capacity bar */}
          <div className="mt-1 flex items-center gap-2">
            <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${isFull ? "bg-slate-500" : "bg-cyan-400"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span
              className={`text-[10px] font-semibold ${isFull ? "text-slate-500" : "text-slate-400"}`}
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              {isFull ? "Full" : `${event.spots - event.filled} spots left`}
            </span>
          </div>

          {/* Dialog for Signup */}
          <Dialog open={isOpen} onOpenChange={(val) => { if (!val) resetForm(); else setIsOpen(true); }}>
            <DialogTrigger asChild>
              <button
                className={`mt-1 self-start text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-200 ${
                  isFull
                    ? "bg-slate-700 text-slate-500 cursor-default"
                    : "bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 hover:bg-cyan-400 hover:text-slate-900"
                }`}
                style={{ fontFamily: "system-ui, sans-serif" }}
              >
                {isFull ? "Join Waitlist" : "Register →"}
              </button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border border-slate-700/60 text-white shadow-2xl rounded-2xl max-w-md p-6 backdrop-blur-xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-white mb-1">
                  {isFull ? "Join the Waitlist" : "Register for Event"}
                </DialogTitle>
                <DialogDescription className="text-slate-400 text-xs mb-4" style={{ fontFamily: "system-ui, sans-serif" }}>
                  {event.title} — {event.displayDate} at {event.time} ({event.difficulty})
                </DialogDescription>
              </DialogHeader>

              {isRegistered ? (
                <div className="text-center py-6 animate-fade-in-up">
                  <div className="w-16 h-16 bg-gradient-to-tr from-cyan-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(34,211,238,0.25)]">
                    <Check className="w-8 h-8 text-slate-900 stroke-[3]" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {isFull ? "Waitlist Request Received!" : "You're Registered!"}
                  </h3>
                  <p className="text-slate-400 text-xs max-w-sm mx-auto mb-6 leading-relaxed" style={{ fontFamily: "system-ui, sans-serif" }}>
                    {isFull 
                      ? "You've been added to the waitlist. We will contact you immediately if a spot opens up."
                      : `A confirmation email has been dispatched to ${email} with safety guidelines and meeting details.`}
                  </p>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-cyan-400 text-slate-900 font-bold text-xs px-6 py-2.5 rounded-full hover:bg-cyan-300 transition-colors"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4 text-left" style={{ fontFamily: "system-ui, sans-serif" }}>
                  {error && (
                    <div className="p-3 rounded-lg bg-red-950/20 border border-red-500/20 text-red-400 text-xs">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Jacques Cousteau"
                      className="w-full h-11 px-4 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="jacques@horizon.org"
                      className="w-full h-11 px-4 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Cert Level</label>
                      <Select value={certLevel} onValueChange={setCertLevel}>
                        <SelectTrigger className="w-full bg-slate-950 border-slate-800 text-white h-11">
                          <SelectValue placeholder="Cert level" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-700 text-white">
                          <SelectItem value="None">None (Beach cleanup)</SelectItem>
                          <SelectItem value="Open Water">Open Water</SelectItem>
                          <SelectItem value="Advanced">Advanced OW</SelectItem>
                          <SelectItem value="Rescue">Rescue Diver</SelectItem>
                          <SelectItem value="Master">Master/Pro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">PADI / Agency #</label>
                      <input
                        type="text"
                        value={certNumber}
                        onChange={(e) => setCertNumber(e.target.value)}
                        placeholder="Optional"
                        className="w-full h-11 px-4 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Disclosures checkboxes */}
                  <div className="space-y-2.5 pt-3 border-t border-slate-800/80">
                    <div className="flex gap-2.5 items-start cursor-pointer" onClick={() => setConductCheck(!conductCheck)}>
                      <Checkbox
                        checked={conductCheck}
                        className="border-slate-500 data-[state=checked]:bg-cyan-400 data-[state=checked]:text-slate-900 mt-0.5"
                      />
                      <span className="text-[11px] text-slate-400 leading-tight">
                        I agree to uphold the zero-impact environmental code of conduct (e.g. strict buoyancy control, no physical contact with coral or marine life).
                      </span>
                    </div>

                    <div className="flex gap-2.5 items-start cursor-pointer" onClick={() => setWaiverCheck(!waiverCheck)}>
                      <Checkbox
                        checked={waiverCheck}
                        className="border-slate-500 data-[state=checked]:bg-cyan-400 data-[state=checked]:text-slate-900 mt-0.5"
                      />
                      <span className="text-[11px] text-slate-400 leading-tight">
                        I agree to the volunteer liability waiver, release, and assume all risk associated with scuba or environmental volunteer work.
                      </span>
                    </div>
                  </div>

                  {/* Submit buttons */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="text-xs font-semibold text-slate-400 hover:text-white px-4 py-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!name.trim() || !email.trim() || !conductCheck || !waiverCheck || loading}
                      className="bg-cyan-400 text-slate-900 font-bold text-xs px-6 py-2.5 rounded-full hover:bg-cyan-300 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed transition-all duration-200 min-w-[100px] flex items-center justify-center gap-1.5"
                    >
                      {loading && <Loader2 className="w-3 h-3 animate-spin text-slate-950" />}
                      {isFull ? "Join Waitlist" : "Confirm"}
                    </button>
                  </div>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export default function ConservationPage() {
  const [activeTag, setActiveTag] = useState("All");
  const [user, setUser] = useState<any>(null);
  const [eventList, setEventList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch current user and conservation events dynamically from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        const [u, eventsData] = await Promise.all([
          apiClient.getCurrentUser(),
          apiClient.getConservationEvents()
        ]);
        
        setUser(u);

        // Format raw DB events to match client EventCard contracts
        if (eventsData) {
          const formatted = eventsData.map((e: any) => {
            const d = new Date(e.date);
            const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            
            return {
              id: e.id,
              title: e.title,
              type: e.eventType === "cleanup" ? "Cleanup" : e.eventType === "restoration" ? "Research" : "Education",
              date: e.date,
              displayDate: `${months[d.getMonth()]} ${d.getDate()}`,
              day: days[d.getDay()],
              time: "9:00 AM", // default time slot
              spots: e.capacity,
              filled: e.capacity - e.spotsRemaining,
              description: e.description,
              difficulty: e.eventType === "cleanup" ? "All levels" : "Open Water+"
            };
          });
          setEventList(formatted);
        }
      } catch (err) {
        console.error("Failed to load conservation data", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const filteredOrgs =
    activeTag === "All" ? orgs : orgs.filter((o) => o.tags.includes(activeTag));

  const handleRegisterSuccess = (title: string, date: string) => {
    setEventList((prev) =>
      prev.map((e) =>
        e.title === title && e.date === date
          ? { ...e, filled: Math.min(e.spots, e.filled + 1) }
          : e
      )
    );
  };

  const getDistinctMonths = () => {
    const mSet = new Set(eventList.map(e => e.displayDate.split(" ")[0]));
    return Array.from(mSet);
  };

  return (
    <div
      className="min-h-screen text-white bg-slate-950"
      style={{
        background: "linear-gradient(160deg, #020d18 0%, #041824 40%, #020d18 100%)",
      }}
    >
      {/* Subtle grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(100,220,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(100,220,255,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 py-20">

        {/* ── HERO ── */}
        <div className="mb-20 pt-16">
          <h1
            className="text-5xl md:text-6xl font-bold leading-tight mb-6"
            style={{ letterSpacing: "-0.02em" }}
          >
            Protect What<br />
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(90deg, #22d3ee, #0ea5e9)" }}
            >
              You Explore
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl leading-relaxed" style={{ fontFamily: "system-ui, sans-serif" }}>
            Every dive is a chance to give back. Below you'll find the organizations doing the most meaningful work in ocean conservation — and the events we host so you can be part of it.
          </p>
        </div>

        {/* ── ORG DIRECTORY ── */}
        <section className="mb-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Conservation Partners</h2>
              <p className="text-slate-500 text-sm" style={{ fontFamily: "system-ui, sans-serif" }}>
                Organizations we trust and actively support.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {ALL_TAGS.map((tag) => (
                <TagPill key={tag} tag={tag} active={activeTag === tag} onClick={() => setActiveTag(tag)} />
              ))}
            </div>
          </div>

          {filteredOrgs.length === 0 ? (
            <p className="text-slate-500 text-sm py-8" style={{ fontFamily: "system-ui, sans-serif" }}>
              No organizations match that filter.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrgs.map((org) => (
                <OrgCard key={org.name} org={org} />
              ))}
            </div>
          )}
        </section>

        {/* ── EVENTS ── */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-1">Upcoming Events</h2>
            <p className="text-slate-500 text-sm" style={{ fontFamily: "system-ui, sans-serif" }}>
              Shop-hosted conservation dives, cleanups, and seminars. Open to all certified divers unless noted.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            </div>
          ) : eventList.length === 0 ? (
            <p className="text-slate-500 py-6 text-sm" style={{ fontFamily: "system-ui, sans-serif" }}>No events scheduled currently.</p>
          ) : (
            getDistinctMonths().map((month) => {
              const monthEvents = eventList.filter((e) => e.displayDate.startsWith(month));
              if (!monthEvents.length) return null;
              return (
                <div key={month} className="mb-10">
                  <div className="flex items-center gap-4 mb-4">
                    <span
                      className="text-slate-600 text-xs uppercase tracking-[0.2em] font-semibold"
                      style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                      {month} {new Date().getFullYear()}
                    </span>
                    <div className="flex-1 h-px bg-slate-800" />
                  </div>
                  <div className="flex flex-col gap-3">
                    {monthEvents.map((event) => (
                      <EventCard 
                        key={event.id} 
                        event={event} 
                        user={user}
                        onRegisterSuccess={handleRegisterSuccess} 
                      />
                    ))}
                  </div>
                </div>
              );
            })
          )}

          {/* Community CTA */}
          <div className="mt-12 rounded-2xl border border-cyan-500/20 bg-cyan-950/20 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-white font-semibold text-lg mb-1">Want to host or suggest an event?</h3>
              <p className="text-slate-400 text-sm" style={{ fontFamily: "system-ui, sans-serif" }}>
                We're always looking to collaborate with local conservation bodies. Get in touch with us!
              </p>
            </div>
            <a
              href="mailto:conservation@bluehorizon.com"
              className="shrink-0 bg-cyan-400 text-slate-900 font-semibold text-sm px-6 py-3 rounded-full hover:bg-cyan-300 transition-colors duration-200"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              Contact conservation staff &rarr;
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}