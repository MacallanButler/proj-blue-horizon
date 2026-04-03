"use client";

import { useState } from "react";

const TIERS = ["All", "Beginner", "Continuing", "Professional"];

const courses = [
  // ── BEGINNER ──
  {
    tier: "Beginner",
    name: "Discover Scuba",
    tagline: "Your first breath underwater",
    duration: "Half day",
    prereqs: "None",
    minAge: 10,
    includes: ["Instructor-led pool session", "Shallow open-water dive", "All equipment provided"],
    elearning: false,
    padiUrl: null,
    price: "Ask us",
    badge: "No cert required",
    badgeColor: "text-emerald-300 bg-emerald-900/40",
    description:
      "Not ready to commit to a full course? Try diving first. A PADI instructor guides you through the basics in a pool, then takes you on a shallow ocean dive. No experience, no certification needed.",
  },
  {
    tier: "Beginner",
    name: "Open Water Diver",
    tagline: "Your lifetime certification",
    duration: "3–5 days",
    prereqs: "None",
    minAge: 10,
    includes: ["PADI eLearning (self-paced)", "Pool confined water sessions", "4 open-water dives", "Certification card"],
    elearning: true,
    padiUrl: "https://store.padi.com/en-us/courses/open-water-diver/p/60462-1B2C/",
    price: "Contact for in-water pricing",
    badge: "Most popular",
    badgeColor: "text-cyan-300 bg-cyan-900/40",
    description:
      "The world's most recognized scuba certification. Complete the knowledge portion online at your own pace, then finish your pool and ocean training with us. Certifies you to dive anywhere in the world.",
  },
  // ── CONTINUING EDUCATION ──
  {
    tier: "Continuing",
    name: "Advanced Open Water",
    tagline: "Expand your depth and range",
    duration: "2–3 days",
    prereqs: "Open Water Diver",
    minAge: 12,
    includes: ["Deep dive (required)", "Underwater navigation (required)", "3 specialty dives of your choice", "Certification card"],
    elearning: true,
    padiUrl: "https://store.padi.com/en-us/courses/advanced-open-water/p/60463-1B2C/",
    price: "Contact for pricing",
    badge: null,
    badgeColor: null,
    description:
      "Five adventure dives — two required, three chosen by you. Options include night diving, underwater photography, fish ID, peak performance buoyancy, and more. Each specialty dive counts toward a full specialty certification.",
  },
  {
    tier: "Continuing",
    name: "Rescue Diver",
    tagline: "Be the diver everyone wants nearby",
    duration: "2–3 days",
    prereqs: "Advanced Open Water + EFR",
    minAge: 12,
    includes: ["Emergency First Response (EFR) course", "Rescue scenarios in pool and open water", "Problem prevention training", "Certification card"],
    elearning: true,
    padiUrl: "https://www.padi.com/courses/rescue-diver",
    price: "Contact for pricing",
    badge: null,
    badgeColor: null,
    description:
      "Most divers call this their most rewarding course. You'll learn to anticipate problems, manage stress, and respond to dive emergencies — improving your own confidence and the safety of every buddy you dive with.",
  },
  {
    tier: "Continuing",
    name: "Enriched Air (Nitrox)",
    tagline: "More bottom time, shorter surface intervals",
    duration: "1 day",
    prereqs: "Open Water Diver",
    minAge: 10,
    includes: ["PADI eLearning or classroom", "Equipment practice", "Certification card"],
    elearning: true,
    padiUrl: "https://www.padi.com/courses/enriched-air-diver",
    price: "Contact for pricing",
    badge: "Quick cert",
    badgeColor: "text-amber-300 bg-amber-900/40",
    description:
      "Dive with higher oxygen mixtures to extend your bottom time and cut surface intervals on repetitive dives. One of the most practical specialty certs available — especially for multi-dive days.",
  },
  {
    tier: "Continuing",
    name: "Peak Performance Buoyancy",
    tagline: "Move less, see more",
    duration: "1–2 days",
    prereqs: "Open Water Diver",
    minAge: 10,
    includes: ["Buoyancy skill dives", "Weight and trim assessment", "Certification card"],
    elearning: true,
    padiUrl: "https://www.padi.com/courses/peak-performance-buoyancy",
    price: "Contact for pricing",
    badge: null,
    badgeColor: null,
    description:
      "The single biggest upgrade most divers can make. Better buoyancy means better air consumption, less reef impact, and a more relaxed dive. Strongly recommended before any conservation or survey dive.",
  },
  // ── PROFESSIONAL ──
  {
    tier: "Professional",
    name: "Divemaster",
    tagline: "Lead dives. Start your career.",
    duration: "Varies (weeks–months)",
    prereqs: "Rescue Diver + 40 logged dives",
    minAge: 18,
    includes: ["Dive theory mastery", "Supervised dive leadership", "Assisting with student courses", "PADI Pro certification"],
    elearning: true,
    padiUrl: "https://www.padi.com/courses/divemaster",
    price: "Contact us for program details",
    badge: "Pro track",
    badgeColor: "text-violet-300 bg-violet-900/40",
    description:
      "The first professional level in PADI's system. As a Divemaster you lead certified divers, assist instructors, and become a recognized underwater guide. Talk to us about our mentored DM program.",
  },
  {
    tier: "Professional",
    name: "Open Water Scuba Instructor",
    tagline: "Teach. Travel. Dive for a living.",
    duration: "IDC + IE (2+ weeks)",
    prereqs: "Divemaster + 100 logged dives",
    minAge: 18,
    includes: ["Instructor Development Course (IDC)", "Emergency First Response Instructor", "PADI Instructor Examination (IE)", "Full instructor certification"],
    elearning: true,
    padiUrl: "https://www.padi.com/courses/open-water-scuba-instructor",
    price: "Contact us for IDC schedule",
    badge: "Pro track",
    badgeColor: "text-violet-300 bg-violet-900/40",
    description:
      "Turn your certification into a career. The IDC covers dive theory, teaching methods, and supervised instruction. Upon passing the independent PADI Instructor Examination, you're certified to teach worldwide.",
  },
];

const TIER_META = {
  Beginner: {
    label: "Beginner",
    description: "No experience needed. Start here.",
    accent: "text-emerald-400",
    border: "border-emerald-500/30",
  },
  Continuing: {
    label: "Continuing Education",
    description: "Expand skills, earn specialties.",
    accent: "text-cyan-400",
    border: "border-cyan-500/30",
  },
  Professional: {
    label: "Professional",
    description: "Lead, teach, and go pro.",
    accent: "text-violet-400",
    border: "border-violet-500/30",
  },
};

function CourseCard({ course }) {
  const [expanded, setExpanded] = useState(false);
  const tm = TIER_META[course.tier];

  return (
    <div
      className={`bg-slate-800/50 border rounded-2xl overflow-hidden transition-all duration-300 hover:bg-slate-800/80 ${
        expanded ? `${tm.border} border-opacity-100` : "border-slate-700/60 hover:border-slate-600/60"
      }`}
    >
      <div className="p-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-white font-semibold text-base leading-tight">{course.name}</h3>
              {course.badge && (
                <span
                  className={`${course.badgeColor} text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider`}
                  style={{ fontFamily: "system-ui, sans-serif" }}
                >
                  {course.badge}
                </span>
              )}
            </div>
            <p className={`${tm.accent} text-xs font-medium uppercase tracking-wider`} style={{ fontFamily: "system-ui, sans-serif" }}>
              {course.tagline}
            </p>
          </div>
        </div>

        {/* Meta row */}
        <div
          className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 mb-4"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          <span>⏱ {course.duration}</span>
          <span>👤 Ages {course.minAge}+</span>
          <span>📋 Prereqs: {course.prereqs}</span>
          {course.elearning && <span className="text-cyan-600">✦ eLearning available</span>}
        </div>

        <p className="text-slate-400 text-sm leading-relaxed mb-4" style={{ fontFamily: "system-ui, sans-serif" }}>
          {course.description}
        </p>

        {/* Expandable includes */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors duration-200 flex items-center gap-1.5 mb-4"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          <span>{expanded ? "Hide" : "What's included"}</span>
          <svg
            className={`w-3 h-3 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {expanded && (
          <ul className="mb-4 flex flex-col gap-1.5">
            {course.includes.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-slate-300"
                style={{ fontFamily: "system-ui, sans-serif" }}
              >
                <span className={`mt-0.5 text-xs ${tm.accent}`}>✦</span>
                {item}
              </li>
            ))}
          </ul>
        )}

        {/* CTA row */}
        <div className="flex items-center justify-between gap-3 flex-wrap pt-2 border-t border-slate-700/40">
          <span className="text-slate-500 text-xs" style={{ fontFamily: "system-ui, sans-serif" }}>
            {course.price}
          </span>
          <div className="flex gap-2">
            {course.elearning && course.padiUrl && (
              <a
                href={course.padiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold px-4 py-1.5 rounded-full border border-slate-600 text-slate-400 hover:border-slate-400 hover:text-slate-200 transition-all duration-200"
                style={{ fontFamily: "system-ui, sans-serif" }}
              >
                Start eLearning ↗
              </a>
            )}
            <a
              href="/booking"
              className="text-xs font-semibold px-4 py-1.5 rounded-full bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 hover:bg-cyan-400 hover:text-slate-900 transition-all duration-200"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              Book in-water →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressionPath() {
  const steps = [
    { label: "Discover Scuba", sub: "Try it first", color: "bg-emerald-400" },
    { label: "Open Water", sub: "Entry cert", color: "bg-cyan-400" },
    { label: "Advanced OW", sub: "Expand range", color: "bg-cyan-500" },
    { label: "Rescue Diver", sub: "Safety skills", color: "bg-blue-400" },
    { label: "Divemaster", sub: "Go pro", color: "bg-violet-400" },
    { label: "Instructor", sub: "Teach", color: "bg-violet-500" },
  ];

  return (
    <div className="mb-20 overflow-x-auto">
      <h2 className="text-2xl font-bold text-white mb-2">The Path</h2>
      <p className="text-slate-500 text-sm mb-8" style={{ fontFamily: "system-ui, sans-serif" }}>
        Every level builds on the last. You can stop at any point — most divers are happiest at Open Water or Advanced.
      </p>
      <div className="flex items-center gap-0 min-w-max">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full ${step.color}`} />
              <div className="mt-2 text-center">
                <div className="text-white text-xs font-semibold whitespace-nowrap" style={{ fontFamily: "system-ui, sans-serif" }}>
                  {step.label}
                </div>
                <div className="text-slate-600 text-[10px] whitespace-nowrap" style={{ fontFamily: "system-ui, sans-serif" }}>
                  {step.sub}
                </div>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className="w-16 h-px bg-slate-700 mx-2 -mt-5" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const [activeTier, setActiveTier] = useState("All");

  const filtered =
    activeTier === "All" ? courses : courses.filter((c) => c.tier === activeTier);

  const grouped = {
    Beginner: filtered.filter((c) => c.tier === "Beginner"),
    Continuing: filtered.filter((c) => c.tier === "Continuing"),
    Professional: filtered.filter((c) => c.tier === "Professional"),
  };

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background: "linear-gradient(160deg, #020d18 0%, #041824 40%, #020d18 100%)",
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      {/* Grid overlay */}
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
        <div className="mb-16">
          <h1
            className="text-5xl md:text-6xl font-bold leading-tight mb-6"
            style={{ letterSpacing: "-0.02em" }}
          >
            Learn to Dive.<br />
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(90deg, #22d3ee, #818cf8)" }}
            >
              Then go deeper.
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl leading-relaxed" style={{ fontFamily: "system-ui, sans-serif" }}>
            All courses run through PADI's certification system. Complete your knowledge development online, then finish your in-water training with us. A 5% marine park and service fee applies to all in-water bookings.
          </p>
        </div>

        {/* ── PROGRESSION PATH ── */}
        <ProgressionPath />

        {/* ── TIER FILTER ── */}
        <div className="flex flex-wrap gap-2 mb-10">
          {TIERS.map((tier) => (
            <button
              key={tier}
              onClick={() => setActiveTier(tier)}
              style={{ fontFamily: "system-ui, sans-serif" }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-200 border ${
                activeTier === tier
                  ? "bg-cyan-400 text-slate-900 border-cyan-400"
                  : "bg-transparent text-slate-400 border-slate-600 hover:border-slate-400 hover:text-slate-200"
              }`}
            >
              {tier}
            </button>
          ))}
        </div>

        {/* ── COURSE GROUPS ── */}
        {Object.entries(grouped).map(([tier, tierCourses]) => {
          if (!tierCourses.length) return null;
          const tm = TIER_META[tier];
          return (
            <div key={tier} className="mb-14">
              <div className="flex items-center gap-4 mb-6">
                <div>
                  <h2 className={`text-lg font-bold ${tm.accent}`}>{tm.label}</h2>
                  <p className="text-slate-600 text-xs mt-0.5" style={{ fontFamily: "system-ui, sans-serif" }}>
                    {tm.description}
                  </p>
                </div>
                <div className="flex-1 h-px bg-slate-800" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tierCourses.map((course) => (
                  <CourseCard key={course.name} course={course} />
                ))}
              </div>
            </div>
          );
        })}

        {/* ── BOTTOM CTA ── */}
        <div className="mt-8 rounded-2xl border border-slate-700/60 bg-slate-800/30 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-white font-semibold text-lg mb-1">Not sure where to start?</h3>
            <p className="text-slate-400 text-sm" style={{ fontFamily: "system-ui, sans-serif" }}>
              Try a Discover Scuba session first — no commitment, no gear, just a dive.
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <a
              href="/booking"
              className="shrink-0 bg-cyan-400 text-slate-900 font-semibold text-sm px-6 py-3 rounded-full hover:bg-cyan-300 transition-colors duration-200"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              Book a try-dive →
            </a>
            <a
              href="/conservation"
              className="shrink-0 border border-slate-600 text-slate-300 font-semibold text-sm px-6 py-3 rounded-full hover:border-slate-400 hover:text-white transition-colors duration-200"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              See our events
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}