# Blue Horizon — Design Brief for Antigravity

## Context
Most of Blue Horizon's visual design already exists and should not be redesigned. This brief documents the existing system for consistency, then gives real direction for the conservation RSVP page, course enrollment, and logbook entry form — these are genuinely new UI, not just rewired existing screens.

## Existing Design System (extracted from `globals.css` — reuse exactly)
- **Ocean palette**: `--color-ocean-dark: #0a192f`, `--color-ocean-mid: #112240`, `--color-ocean-light: #233554`, `--color-ocean-deep: #020c1b` (near-black base), `--color-ocean-foam: #64ffda` (bright teal accent — likely used sparingly for highlights/success states)
- **Heading font**: Playfair Display (serif — elegant, editorial, matches the "premium ocean design service" positioning from the README)
- **Body font**: Inter
- **Radius**: `0.5rem` base, with `-sm`/`-md` variants
- **Overall aesthetic**: deep-navy-to-turquoise gradient, glassy/backdrop-blur cards (see `PADIVerification.tsx`'s `backdrop-blur-sm` usage), soft fade-in-up entrance animations — calmer and more editorial than Apex's tactical dark theme. Do not reuse Apex's aesthetic here; these are deliberately different brand voices.

## New UI Needed

**1. Conservation events + RSVP (`/conservation`)**
- This page currently has zero dynamic content — add an event list section below the existing static initiatives, styled consistently (same card treatment: `bg-ocean-mid/30`, `border-ocean-light/20`, backdrop-blur, matching the initiative cards already there)
- Each event card: title, date, location, spots remaining, a short description, and an RSVP button
- RSVP form: name + email (pre-filled if logged in), no payment (these are free) — keep it to one step, this should feel like the lowest-friction action on the whole site
- After RSVP: simple confirmation state on the card itself ("You're going! 🌊" or similar) rather than a redirect — keep momentum on the conservation page

**2. Course enrollment (`/courses`)**
- Add an "Enroll" CTA to each existing course card
- Enrollment flow reuses the booking wizard's visual pattern (steps, Stripe Elements styled the same as whatever you build for trip payment) rather than inventing a new flow — consistency over novelty here
- Show deposit vs. total clearly, same principle as Apex: "Deposit to reserve your spot: $150 · Balance due before course start: $450"

**3. Logbook entry form (`/logbook`)**
- "Log a dive" button opens a form matching the existing `LogEntry` fields (site, date, depth, duration, water temp, visibility, highlights)
- If entry is auto-created from a completed booking, pre-fill site/date and let the diver fill in the experiential fields (depth reached, highlights) — don't make them re-enter what the system already knows
- Keep the card-based log display exactly as it exists now; the form is additive, not a redesign

**4. Cert verification form (replaces the fake `PADIVerification.tsx` lookup)**
- Cert number input (keep the existing `XX-XXXXXXX` format hint/masking — it's good UX), a level dropdown instead of the simulated lookup, and an optional file upload for the cert card photo
- Status states to design: "Submitted — pending staff review" (amber, matches existing amber warning styling) vs. "Verified" (green, matches existing verified styling) — reuse the existing status color/icon pattern in that component exactly, just change what drives the state

## Explicitly Out of Scope
Do not touch: Hero/homepage, DiveSiteCard, DiveSiteMap, MarineLifeCalendar, Navigation, Footer — no backend dependency, already finished.
