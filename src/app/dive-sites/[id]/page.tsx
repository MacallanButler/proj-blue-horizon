import Link from "next/link";
import { ArrowLeft, MapPin, Star, Droplets, Thermometer, Wind, Fish, Anchor } from "lucide-react";
import MarineLifeCalendar from "@/components/features/MarineLifeCalendar";
import PADIVerification from "@/components/features/PADIVerification";

export default async function DiveSiteDetails({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // Fetch site data from the Rails API
    let site = null;
    try {
        const res = await fetch(`http://localhost:3001/api/v1/dive_sites/${id}`, { cache: "no-store" });
        if (res.ok) {
            site = await res.json();
        }
    } catch (err) {
        console.error("Failed to fetch dive site details from API", err);
    }

    if (!site) {
        return <div className="pt-32 text-center text-white min-h-screen">Site not found.</div>;
    }

    return (
        <div className="min-h-screen pb-20 bg-slate-950">
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.025]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(100,220,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(100,220,255,1) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />

            {/* Hero image */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent z-10" />
                <img src={site.imageUrl} alt={site.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 w-full z-20 container mx-auto px-6 pb-12">
                    <Link
                        href="/dive-sites"
                        className="inline-flex items-center text-slate-400 hover:text-cyan-400 mb-6 transition-colors text-sm"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sites
                    </Link>
                    <div className="flex flex-col md:flex-row items-end justify-between gap-6">
                        <div>
                            <span
                                className="inline-block px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4 border border-cyan-400/20"
                                style={{ fontFamily: "system-ui, sans-serif" }}
                            >
                                {site.difficulty}
                            </span>
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2" style={{ letterSpacing: "-0.02em" }}>
                                {site.name}
                            </h1>
                            <div className="flex items-center gap-2 text-slate-300" style={{ fontFamily: "system-ui, sans-serif" }}>
                                <MapPin className="h-4 w-4 text-cyan-400" />
                                <span className="text-lg">{site.location}, {site.country}</span>
                                <span className="mx-2 text-slate-600">•</span>
                                <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                    <span className="font-bold text-white">{site.rating}</span>
                                    <span className="text-sm">({site.reviews} reviews)</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Link
                                href={`/booking?site=${site.id}`}
                                className="bg-cyan-400 text-slate-900 font-bold text-sm px-6 py-3.5 rounded-full hover:bg-cyan-300 transition-colors duration-200"
                                style={{ fontFamily: "system-ui, sans-serif" }}
                            >
                                Book This Dive
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 pt-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <Anchor className="h-6 w-6 text-cyan-400" /> About the Dive
                            </h2>
                            <p className="text-slate-300 leading-loose text-lg" style={{ fontFamily: "system-ui, sans-serif" }}>
                                {site.description}
                            </p>
                        </section>

                        {/* Stats Grid */}
                        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700/40 flex flex-col items-center text-center">
                                <div className="bg-blue-500/10 p-3 rounded-full mb-3">
                                    <Thermometer className="h-6 w-6 text-blue-400" />
                                </div>
                                <span className="text-slate-400 text-sm mb-1">Water Temp</span>
                                <span className="text-xl font-bold text-white">{site.temperature.min}°C - {site.temperature.max}°C</span>
                            </div>
                            <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700/40 flex flex-col items-center text-center">
                                <div className="bg-teal-500/10 p-3 rounded-full mb-3">
                                    <Droplets className="h-6 w-6 text-teal-400" />
                                </div>
                                <span className="text-slate-400 text-sm mb-1">Visibility</span>
                                <span className="text-xl font-bold text-white">{site.visibility.min}m - {site.visibility.max}m</span>
                            </div>
                            <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700/40 flex flex-col items-center text-center">
                                <div className="bg-indigo-500/10 p-3 rounded-full mb-3">
                                    <Wind className="h-6 w-6 text-indigo-400" />
                                </div>
                                <span className="text-slate-400 text-sm mb-1">Current Strength</span>
                                <span className="text-xl font-bold text-white">{site.currentStrength}</span>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <Fish className="h-5 w-5 text-cyan-400" /> Marine Life Calendar
                            </h2>
                            <MarineLifeCalendar bestMonths={site.bestMonths} />
                            <div className="mt-4 flex flex-wrap gap-2">
                                {site.marineLife.map((animal: string) => (
                                    <span
                                        key={animal}
                                        className="px-3 py-1 rounded-full bg-slate-800/60 border border-slate-700/60 text-slate-300 text-sm"
                                        style={{ fontFamily: "system-ui, sans-serif" }}
                                    >
                                        {animal}
                                    </span>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="space-y-6">
                        <PADIVerification
                            siteId={site.id}
                            requiredLevel={site.difficulty === "Beginner" ? "Open Water" : "Advanced"}
                        />

                        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/60">
                            <h3 className="text-lg font-bold text-white mb-4">Underwater Topography</h3>
                            <div className="relative h-64 w-full rounded-xl overflow-hidden border border-slate-700/40" style={{ background: "#020c1b" }}>
                                <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    <path d="M0,0 Q50,50 100,0 V100 H0 Z" fill="#0a192f" />
                                    <path d="M0,20 Q50,70 100,20 V100 H0 Z" fill="#112240" />
                                    <path d="M0,40 Q50,90 100,40 V100 H0 Z" fill="#233554" />
                                </svg>
                                <div className="absolute right-2 top-4 flex flex-col gap-8 text-[10px] text-slate-500 font-mono text-right">
                                    <span>0m</span><span>-10m</span><span>-20m</span><span>-30m</span>
                                </div>
                                <div className="absolute bottom-4 left-4">
                                    <div className="text-xs text-slate-400" style={{ fontFamily: "system-ui, sans-serif" }}>Max Depth</div>
                                    <div className="text-2xl font-bold text-white">{site.depth.max}m</div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl p-6 border border-cyan-500/20 bg-cyan-950/20">
                            <h3 className="text-lg font-bold text-white mb-2">Dive with Purpose</h3>
                            <p className="text-sm text-slate-400 mb-4" style={{ fontFamily: "system-ui, sans-serif" }}>
                                This site participates in the Coral Watch monitoring program.
                            </p>
                            <Link
                                href="/conservation"
                                className="flex items-center justify-center w-full text-xs font-semibold px-4 py-2.5 rounded-full border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900 transition-all duration-200"
                                style={{ fontFamily: "system-ui, sans-serif" }}
                            >
                                View Conservation Events →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}