# Blue Horizon — Rails API Backend — Technical Brief for Antigravity

## Context
Blue Horizon is an existing Next.js 15 + TypeScript + Tailwind v3 + Shadcn + Framer Motion frontend for a dive-site booking and conservation platform. Dive-site browsing, the booking wizard, pricing, and cert verification are fully built but backed by static mock data (`src/data/mockData.ts`) with no persistence. The conservation RSVP feature and course enrollment do not exist yet as functional UI — they are static content pages. This brief covers both: **wiring existing UI to a real Rails API**, and **building the missing RSVP/enrollment/logbook features** end to end (backend + new frontend UI).

Reuse the same conventions as the Apex backend (Devise+JWT+Pundit, Rails API-only, Render deployment) for consistency across your portfolio, but do not copy Apex's Action Cable or deposit-everywhere patterns — the scope differs intentionally (see brief context above).

## Stack
- **Backend**: Ruby on Rails 8.1.3, API-only mode
- **Database**: SQLite3 (for local development and self-contained portability)
- **Background jobs**: Active Job (using database-backed Solid Queue or async adapter in development)
- **Auth**: Devise + `devise-jwt`
- **Authorization**: Pundit — roles: Diver (default authenticated), Staff, Admin. Guest (unauthenticated) can browse and book single dive trips only.
- **Payments**: Stripe — full payment at booking for dive trips; deposit + balance for course enrollments (Stripe checkout/intent creation mocked locally)
- **File storage**: Active Storage (using Local Disk service for development, S3-compatible bucket for production)
- **Email**: ActionMailer + Resend (or console letter_opener for local development)
- **Deployment**: Rails API with SQLite database + Active Job on Render/Fly.io; Next.js frontend on Vercel; CORS configured for the Vercel domain

## Data Models

```
User
  - email, encrypted_password (Devise)
  - role: enum [diver, staff, admin]
  - name, phone
  - padi_cert_number, padi_cert_level (enum: open_water, advanced, rescue, divemaster, instructor), nullable
  - cert_card_photo (Active Storage attachment, nullable)
  - cert_verified_by_staff (boolean, default false)

DiveSite  (seed from existing mockData.ts — id, name, location, country, depth,
           visibility, temperature, difficulty, marine life, best months, etc.
           This table is close to static/reference data — admin-editable, not
           user-generated)

TimeSlot / Trip
  - dive_site_id (references DiveSite)
  - date, departure_time
  - capacity (integer)
  - required_cert_level (enum, mirrors DiveSite.difficulty)
  - unique index on [dive_site_id, date, departure_time]

Booking
  - user_id (nullable — guest allowed for single-trip bookings only)
  - guest_name, guest_email, guest_phone (nullable, required if user_id is nil)
  - trip_id (references Trip)
  - gear_selections (jsonb array — BCD, regulator, wetsuit, etc., matches existing availableGear)
  - extras (jsonb array — nitrox, photographer, private guide)
  - conservation_fee_cents (flat mandatory fee, matches existing "transparent pricing" copy)
  - total_cents, status (enum: pending_payment, confirmed, completed, cancelled)
  - stripe_payment_intent_id
  - validates: guest bookings require required_cert_level <= "Open Water" OR a
    verified cert_level on file — course-gated advanced sites cannot be guest-booked

Course
  - title, level (enum matches courses/page.tsx), duration_days, price_cents, description

CourseEnrollment
  - user_id (required — courses require an account, unlike single dive trips)
  - course_id
  - status (enum: pending_deposit, enrolled, completed, cancelled)
  - deposit_paid_cents, balance_due_cents
  - stripe_payment_intent_id (deposit), stripe_balance_intent_id (balance, charged before start)

ConservationEvent
  - title, description, event_type (enum: cleanup, restoration, workshop)
  - date, location, capacity
  - icon/category matches existing initiatives styling

RSVP
  - user_id (nullable — guest RSVP allowed, these are free community events)
  - conservation_event_id
  - guest_name, guest_email (nullable, required if user_id nil)
  - attended (boolean, set by staff after the event — feeds ImpactStats)

LogEntry
  - user_id (required)
  - booking_id (nullable — can be auto-created from a completed Booking, or
    manually added by the diver for dives done elsewhere)
  - site_name, date, depth, duration, water_temp, visibility, highlights (text)

ImpactStats (single-row rollup table, or a cached Redis hash — pick one and be
  consistent; recommend a rollup table refreshed nightly via Sidekiq)
  - coral_fragments_planted, co2_offset_kg, marine_animals_tagged, conservation_fund_cents
  - computed from: completed Bookings' conservation_fee_cents (fund), attended RSVPs
    tagged as "restoration" type (coral fragments — define a simple multiplier), etc.
  - Document the computation logic clearly in a service object
    (`ImpactStatsCalculator`) — this replaces ImpactCounters.tsx's hardcoded targets
    with real, explainable numbers
```

## API Endpoints (all under `/api/v1`)

**Auth** — same shape as Apex: register, login, logout, guest_upgrade

**Public / Guest-accessible**
- `GET /dive_sites`, `GET /dive_sites/:id` — with `predicted_marine_life` computed server-side using the same scoring logic as `marineAnalytics.ts` (port this algorithm into a `MarineLifePredictionService` — it's deterministic and pure, ports cleanly)
- `GET /trips?dive_site_id=&date_from=&date_to=&min_cert_level=` — filtered availability (matches "booking filtered by dive location/experience level")
- `POST /bookings` — guest or authenticated; server validates cert level against `required_cert_level` before allowing creation
- `POST /bookings/:id/payment_intent`
- `POST /webhooks/stripe`
- `GET /conservation_events` — upcoming events list (this is net-new UI, see design brief)
- `POST /rsvps` — guest or authenticated, free, capacity-checked
- `GET /courses`
- `GET /impact_stats` — powers ImpactCounters with real numbers

**Diver (authenticated)**
- `GET /bookings/mine`, `GET /rsvps/mine`
- `GET /log_entries`, `POST /log_entries`, `PATCH /log_entries/:id`
- `POST /course_enrollments` — deposit flow
- `PATCH /users/me/cert` — submit cert number + level + card photo, sets `cert_verified_by_staff: false` pending review

**Staff (authenticated, role=staff or admin)**
- `PATCH /users/:id/verify_cert` — approve/reject a submitted cert
- CRUD on `ConservationEvent`, `Course`, `Trip`
- `PATCH /rsvps/:id/attendance` — mark attended after the event (feeds ImpactStats)

**Admin**
- Full CRUD on `DiveSite`
- `PATCH /users/:id/role`

## Business Logic / Service Objects
- `MarineLifePredictionService` — direct port of `marineAnalytics.ts`'s scoring algorithm (month/temperature/current-strength weighted scoring against species preferences) — keep the exact same thresholds so results match what the frontend already displays for consistency during migration
- `TripAvailabilityService` — capacity check with a `SELECT ... FOR UPDATE` row lock at booking time (optimistic locking is enough here — no Action Cable, see context note above)
- `CertVerificationService` — checks self-attested `padi_cert_level` against a `Trip.required_cert_level`; if `cert_verified_by_staff` is false, still allow booking but flag it for staff review before the trip date (realistic: shops don't block bookings on paperwork, they chase it before departure)
- `ImpactStatsCalculator` — nightly Sidekiq job recomputes the rollup table from real booking/RSVP data

## Security
- Pundit policies per role, same discipline as Apex
- Cert card photo uploads: validate file type/size, store via Active Storage, never expose direct S3 URLs — serve through a signed, expiring Rails redirect
- Stripe webhook signature verification
- Rate limit `/bookings` and `/rsvps` creation (rack-attack)

## Frontend Integration — Files to Change
- `src/data/mockData.ts` — dive site data migrates to the database; keep the TypeScript `DiveSite` interface as the contract for `apiClient` responses
- New `src/lib/apiClient.ts` (mirror Apex's — typed fetch wrapper)
- `src/app/booking/page.tsx` — wire the wizard's final "Review" step to `apiClient.createBooking()` + Stripe Elements
- `src/app/dive-sites/page.tsx`, `src/app/dive-sites/[id]/page.tsx` — fetch from `apiClient.getDiveSites()` instead of static import
- `src/components/features/PADIVerification.tsx` — replace the fake checksum lookup with a real self-attestation form (cert number + level dropdown + optional photo upload) submitting to `PATCH /users/me/cert`
- `src/app/conservation/page.tsx` — **build new**: event list fetched from `apiClient.getConservationEvents()`, each with an RSVP button/form (this is genuinely new UI, not a rewire — see design brief)
- `src/app/courses/page.tsx` — add enrollment CTA per course, wired to `apiClient.createCourseEnrollment()` + Stripe deposit flow
- `src/app/logbook/page.tsx` — replace `sampleLogs` with `apiClient.getLogEntries()`, add a "log a dive" form (new UI)
- `src/components/features/ImpactCounters.tsx` — replace hardcoded `TARGETS` array with a fetch to `GET /impact_stats`, keep the existing count-up animation logic as-is

## Seed Data
Seed all existing `mockData.ts` dive sites, a handful of Trips per site across the next 30 days, 2-3 sample Courses, 2-3 upcoming ConservationEvents, and one Staff + one Admin + one Diver user so the demo isn't empty on first deploy.

## Repo Hygiene (before this goes on a portfolio)
Delete the stale `trial 4.3/` directory and `v1.zip` from the repo root — leftover duplicate versions that shouldn't ship in a reviewed codebase.
