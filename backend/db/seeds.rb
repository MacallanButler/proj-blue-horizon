# Seed Users
puts "Seeding Users..."
admin = User.find_or_initialize_by(email: "admin@bluehorizon.com")
admin.update!(
  password: "password123",
  name: "Captain Admin",
  phone: "+15550100",
  role: :admin,
  padi_cert_level: :instructor,
  cert_verified_by_staff: true
)

staff = User.find_or_initialize_by(email: "staff@bluehorizon.com")
staff.update!(
  password: "password123",
  name: "Sarah Staff",
  phone: "+15550101",
  role: :staff,
  padi_cert_level: :divemaster,
  cert_verified_by_staff: true
)

diver1 = User.find_or_initialize_by(email: "diver@bluehorizon.com")
diver1.update!(
  password: "password123",
  name: "David Diver",
  phone: "+15550102",
  role: :diver,
  padi_cert_level: :advanced,
  cert_verified_by_staff: true
)

diver2 = User.find_or_initialize_by(email: "newdiver@bluehorizon.com")
diver2.update!(
  password: "password123",
  name: "Nancy Novice",
  phone: "+15550103",
  role: :diver,
  padi_cert_level: :open_water,
  cert_verified_by_staff: false
)

# Seed Dive Sites
puts "Seeding Dive Sites..."
sites_data = [
  {
    id: "blue-corner",
    name: "Blue Corner",
    location: "Palau",
    country: "Micronesia",
    depth_min: 8,
    depth_max: 30,
    visibility_min: 20,
    visibility_max: 40,
    temperature_min: 27,
    temperature_max: 29,
    difficulty: "Advanced",
    rating: 4.9,
    reviews: 328,
    description: "Famous for its strong currents and massive schools of fish. Use a reef hook and watch the show. Sharks, barracudas, and eagle rays are common.",
    image_url: "/assets/sites/wouter-naert-m6Sfxlts7SI-unsplash.jpg",
    lat: 7.1373,
    lng: 134.2238,
    marine_life: ["Grey Reef Sharks", "Barracudas", "Eagle Rays", "Napoleon Wrasse"],
    best_months: [0, 1, 2, 3, 10, 11],
    current_strength: "Strong",
    features: ["Drift", "Wall", "Big Fish"]
  },
  {
    id: "yongala",
    name: "SS Yongala",
    location: "Great Barrier Reef",
    country: "Australia",
    depth_min: 14,
    depth_max: 28,
    visibility_min: 10,
    visibility_max: 25,
    temperature_min: 22,
    temperature_max: 28,
    difficulty: "Advanced",
    rating: 4.8,
    reviews: 215,
    description: "One of the best wreck dives in the world. The ship sank in 1911 and is now a thriving artificial reef with incredible biodiversity.",
    image_url: "/assets/sites/neom-yx7TJle8LhM-unsplash.jpg",
    lat: -19.3086,
    lng: 147.6231,
    marine_life: ["Giant Groupers", "Sea Snakes", "Turtles", "Rays"],
    best_months: [5, 6, 7, 8],
    current_strength: "Moderate",
    features: ["Wreck", "Historic"]
  },
  {
    id: "great-blue-hole",
    name: "Great Blue Hole",
    location: "Belize City",
    country: "Belize",
    depth_min: 0,
    depth_max: 124,
    visibility_min: 15,
    visibility_max: 30,
    temperature_min: 26,
    temperature_max: 28,
    difficulty: "Advanced",
    rating: 4.6,
    reviews: 540,
    description: "A giant marine sinkhole. The dive involves descending to see ancient stalactites. Crystal clear water and reef sharks patrolling the depths.",
    image_url: "/assets/sites/neom-HYHYGLs-Rp8-unsplash.jpg",
    lat: 17.3160,
    lng: -87.5351,
    marine_life: ["Exotic Fish", "Reef Sharks", "Stalactites"],
    best_months: [3, 4, 5],
    current_strength: "None",
    features: ["Sinkhole", "Geology"]
  },
  {
    id: "manta-point",
    name: "Manta Point",
    location: "Nusa Penida",
    country: "Indonesia",
    depth_min: 5,
    depth_max: 20,
    visibility_min: 15,
    visibility_max: 25,
    temperature_min: 22,
    temperature_max: 26,
    difficulty: "Beginner",
    rating: 4.7,
    reviews: 412,
    description: "A cleaning station where majestic Manta Rays come to be cleaned by cleaner wrasse. A magical experience accessible to all levels.",
    image_url: "/assets/sites/sebastian-pena-lambarri-44r12Ck_CoI-unsplash.jpg",
    lat: -8.7884,
    lng: 115.5398,
    marine_life: ["Manta Rays", "Bamboo Sharks", "Blue Spotted Rays"],
    best_months: [3, 4, 5, 6, 7, 8, 9, 10],
    current_strength: "Mild",
    features: ["Reef", "Marine Life"]
  }
]

dive_sites = {}
sites_data.each do |data|
  site = DiveSite.find_or_initialize_by(id: data[:id])
  site.update!(data.except(:id))
  dive_sites[data[:id]] = site
end

# Seed Courses
puts "Seeding Courses..."
courses_data = [
  { id: "discover-scuba", title: "Discover Scuba", level: :beginner, duration_days: 1, price_cents: 11000, description: "Not ready to commit to a full course? Try diving first. Learn basic safety concepts in a pool, then go on a shallow ocean dive with an instructor." },
  { id: "open-water", title: "Open Water Diver", level: :beginner, duration_days: 4, price_cents: 45000, description: "The world's most recognized entry certification. Complete online theory, then do pool and ocean training. Certifies you to dive down to 18m." },
  { id: "advanced-ow", title: "Advanced Open Water", level: :continuing, duration_days: 3, price_cents: 38000, description: "Expand your skill set with specialty dives including deep diving (down to 30m) and underwater navigation, plus 3 specialties of your choice." },
  { id: "rescue-diver", title: "Rescue Diver", level: :continuing, duration_days: 3, price_cents: 42000, description: "Learn to prevent and manage emergencies in the water. Build confidence and improve your safety awareness." },
  { id: "nitrox", title: "Enriched Air (Nitrox)", level: :continuing, duration_days: 1, price_cents: 15000, description: "Extend your bottom time and shorten surface intervals. Learn to analyze gas blends and plan enriched air dives." },
  { id: "buoyancy", title: "Peak Performance Buoyancy", level: :continuing, duration_days: 2, price_cents: 18000, description: "Master your hover, weight, and trim. Essential for protecting delicate coral reefs and improving air consumption." },
  { id: "divemaster", title: "Divemaster", level: :professional, duration_days: 30, price_cents: 85000, description: "Begin your professional career. Master dive theory, hone rescue skills, and learn to supervise student divers." },
  { id: "instructor", title: "Open Water Scuba Instructor", level: :professional, duration_days: 14, price_cents: 140000, description: "Turn your passion into a career. Learn to teach the PADI curriculum and certify new divers worldwide." }
]

courses = {}
courses_data.each do |data|
  course = Course.find_or_initialize_by(title: data[:title])
  course.update!(data.except(:id))
  courses[data[:id]] = course
end

# Seed Trips
puts "Seeding Trips..."
Trip.destroy_all # clear out old trips for fresh dates
today = Date.today
trips = []

# Create 1 daily trip for each site for the next 15 days
(0..14).each do |offset|
  date = today + offset
  dive_sites.each do |id, site|
    # Alternate morning and afternoon times
    time = offset.even? ? "08:30" : "13:30"
    
    cert_level = case site.difficulty.downcase
                 when 'beginner' then :open_water
                 when 'intermediate' then :open_water
                 when 'advanced' then :advanced
                 when 'expert' then :rescue
                 else :open_water
                 end

    trip = Trip.create!(
      dive_site: site,
      date: date,
      departure_time: time,
      capacity: 8,
      required_cert_level: cert_level
    )
    trips << trip
  end
end

# Seed Conservation Events
puts "Seeding Conservation Events..."
ConservationEvent.destroy_all
events_data = [
  {
    title: "Coral Reef Restoration Workshop",
    description: "Join us in our coral nursery! Learn sustainable coral gardening techniques and assist staff in planting staghorn fragments onto artificial structures.",
    event_type: :restoration,
    date: today + 4,
    location: "Raja Ampat Restoration Nursery",
    capacity: 15
  },
  {
    title: "Manta Sandy Beach & Reef Cleanup",
    description: "Help us remove marine debris and plastic from nesting grounds and shallow reefs. Every piece of trash collected is logged for scientific database analysis.",
    event_type: :cleanup,
    date: today + 7,
    location: "Manta Sandy Marine Park",
    capacity: 25
  },
  {
    title: "Marine Life & Species Census Workshop",
    description: "An educational evening event. Learn to identify local reef species, sharks, and rays, and understand how to log data during recreational dives.",
    event_type: :workshop,
    date: today + 10,
    location: "Blue Horizon Eco-Center",
    capacity: 30
  }
]

events = []
events_data.each do |data|
  events << ConservationEvent.create!(data)
end

# Seed RSVPs
puts "Seeding RSVPs..."
Rsvp.destroy_all
# Past/Present RSVPs that are attended
Rsvp.create!(user: diver1, conservation_event: events[0], attended: true)
Rsvp.create!(user: diver2, conservation_event: events[0], attended: true)
Rsvp.create!(guest_name: "Gillian Guest", guest_email: "gillian@example.com", conservation_event: events[0], attended: true)
# Upcoming RSVPs (not attended yet)
Rsvp.create!(user: diver1, conservation_event: events[1], attended: false)
Rsvp.create!(guest_name: "Tom Robinson", guest_email: "tom@example.com", conservation_event: events[1], attended: false)

# Seed Bookings
puts "Seeding Bookings..."
Booking.destroy_all
# Completed bookings (to populate logs and stats)
b1 = Booking.create!(
  user: diver1,
  trip: trips.find { |t| t.dive_site_id == "manta-point" },
  gear_selections: ["wetsuit", "computer"],
  extras: ["guide"],
  conservation_fee_cents: 1000,
  total_cents: 25500,
  status: :completed,
  stripe_payment_intent_id: "mock_pi_1"
)

b2 = Booking.create!(
  guest_name: "Gary Guest",
  guest_email: "gary@example.com",
  guest_phone: "+15558888",
  trip: trips.find { |t| t.dive_site_id == "manta-point" },
  gear_selections: [],
  extras: [],
  conservation_fee_cents: 1000,
  total_cents: 15000,
  status: :completed,
  stripe_payment_intent_id: "mock_pi_2"
)

# Confirmed upcoming bookings
Booking.create!(
  user: diver1,
  trip: trips.find { |t| t.dive_site_id == "blue-corner" && t.date > today },
  gear_selections: ["computer"],
  extras: ["nitrox"],
  conservation_fee_cents: 1000,
  total_cents: 17700,
  status: :confirmed,
  stripe_payment_intent_id: "mock_pi_3"
)

# Seed Log Entries
puts "Seeding Log Entries..."
LogEntry.destroy_all
LogEntry.create!(
  user: diver1,
  booking: b1,
  site_name: "Manta Point",
  date: today - 5,
  depth: 18,
  duration: 48,
  water_temp: 26,
  visibility: 20,
  highlights: "Majestic manta rays at the cleaning station. Spotted a sleeping bamboo shark."
)

LogEntry.create!(
  user: diver1,
  site_name: "Coral Gardens",
  date: today - 10,
  depth: 15,
  duration: 52,
  water_temp: 27,
  visibility: 25,
  highlights: "Beautiful staghorn coral fields. perfect buoyancy training day."
)

# Initialize and Calculate Impact Stats
puts "Calculating Impact Stats..."
ImpactStatsCalculator.calculate!

puts "Seeds loaded successfully! 🌊"
