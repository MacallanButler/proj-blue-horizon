import Link from "next/link";
import Image from "next/image";
import { diveSites } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Star, Droplets, Thermometer, Wind, Fish, Anchor } from "lucide-react";
import MarineLifeCalendar from "@/components/features/MarineLifeCalendar";

export default async function DiveSiteDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const site = diveSites.find((s) => s.id === id);

    if (!site) {
        return <div className="pt-32 text-center text-white">Site not found</div>;
    }

    return (
        <div className="min-h-screen bg-ocean-dark pb-20">
            {/* Hero Header */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-ocean-dark to-transparent z-10" />
                <Image
                    src={site.imageUrl}
                    alt={site.name}
                    fill
                    priority
                    className="object-cover"
                />
                {/* Note: In production, consider using next/image with layout="fill" but it requires object-fit */}

                <div className="absolute bottom-0 left-0 w-full z-20 container mx-auto px-6 pb-12">
                    <Link href="/dive-sites" className="inline-flex items-center text-slate-300 hover:text-white mb-6 transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sites
                    </Link>
                    <div className="flex flex-col md:flex-row items-end justify-between gap-6">
                        <div>
                            <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4 border border-primary/20">
                                {site.difficulty}
                            </span>
                            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-2">
                                {site.name}
                            </h1>
                            <div className="flex items-center gap-2 text-slate-300">
                                <MapPin className="h-5 w-5 text-primary" />
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
                            <Button asChild size="lg" className="bg-primary text-ocean-deep font-bold h-14 px-8 text-lg shadow-lg shadow-primary/20">
                                <Link href="/booking">Book This Dive</Link>
                            </Button>
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
                                <Anchor className="h-6 w-6 text-primary" /> About the Dive
                            </h2>
                            <p className="text-slate-300 leading-loose text-lg">
                                {site.description}
                            </p>
                        </section>

                        {/* Stats Grid */}
                        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-ocean-mid/50 p-6 rounded-xl border border-ocean-light/10 flex flex-col items-center text-center">
                                <div className="bg-blue-500/10 p-3 rounded-full mb-3">
                                    <Thermometer className="h-6 w-6 text-blue-400" />
                                </div>
                                <span className="text-slate-400 text-sm mb-1">Water Temp</span>
                                <span className="text-xl font-bold text-white">{site.temperature.min}°C - {site.temperature.max}°C</span>
                            </div>
                            <div className="bg-ocean-mid/50 p-6 rounded-xl border border-ocean-light/10 flex flex-col items-center text-center">
                                <div className="bg-teal-500/10 p-3 rounded-full mb-3">
                                    <Droplets className="h-6 w-6 text-teal-400" />
                                </div>
                                <span className="text-slate-400 text-sm mb-1">Visibility</span>
                                <span className="text-xl font-bold text-white">{site.visibility.min}m - {site.visibility.max}m</span>
                            </div>
                            <div className="bg-ocean-mid/50 p-6 rounded-xl border border-ocean-light/10 flex flex-col items-center text-center">
                                <div className="bg-indigo-500/10 p-3 rounded-full mb-3">
                                    <Wind className="h-6 w-6 text-indigo-400" />
                                </div>
                                <span className="text-slate-400 text-sm mb-1">Current</span>
                                <span className="text-xl font-bold text-white">{site.currentStrength}</span>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <Fish className="h-6 w-6 text-primary" /> Marine Life Calendar
                            </h2>
                            <MarineLifeCalendar bestMonths={site.bestMonths} />
                            <div className="mt-6 flex flex-wrap gap-2">
                                {site.marineLife.map((animal) => (
                                    <span key={animal} className="px-3 py-1 rounded-full bg-ocean-light/30 border border-ocean-light/20 text-slate-300 text-sm">
                                        {animal}
                                    </span>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6">Crowd Forecast</h2>
                            <div className="bg-ocean-dark/30 border border-ocean-light/10 rounded-xl p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex-1">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-slate-400">Current Crowd Level</span>
                                            <span className="text-primary font-bold">Moderate</span>
                                        </div>
                                        <div className="h-2 bg-ocean-deep rounded-full overflow-hidden">
                                            <div className="h-full bg-yellow-500 w-[60%] rounded-full" />
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-xs text-slate-500">Predicted for Today</span>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-400">
                                    To avoid crowds, we recommend booking a morning dive (around 8:00 AM) or visiting on weekdays.
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar / Topography Map */}
                    <div className="space-y-8">
                        <div className="bg-ocean-mid p-6 rounded-2xl border border-ocean-light/20 shadow-xl overflow-hidden relative">
                            <h3 className="text-lg font-bold text-white mb-4">Underwater Topography</h3>
                            {/* Simulated Depth Map UI */}
                            <div className="relative h-64 w-full bg-[#020c1b] rounded-lg overflow-hidden border border-ocean-light/10">
                                {/* Contour Lines (SVG) */}
                                <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    <path d="M0,0 Q50,50 100,0 V100 H0 Z" fill="#0a192f" />
                                    <path d="M0,20 Q50,70 100,20 V100 H0 Z" fill="#112240" />
                                    <path d="M0,40 Q50,90 100,40 V100 H0 Z" fill="#233554" />
                                </svg>

                                {/* Depth Markers */}
                                <div className="absolute right-2 top-4 flex flex-col gap-8 text-[10px] text-slate-500 font-mono text-right">
                                    <span>0m</span>
                                    <span>-10m</span>
                                    <span>-20m</span>
                                    <span>-30m</span>
                                </div>

                                <div className="absolute bottom-4 left-4">
                                    <div className="text-xs text-slate-400">Max Depth</div>
                                    <div className="text-2xl font-bold text-white">{site.depth.max}m</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20">
                            <h3 className="text-lg font-bold text-white mb-2">Dive with Purpose</h3>
                            <p className="text-sm text-slate-400 mb-4">
                                This site participates in the Coral Watch monitoring program.
                            </p>
                            <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-ocean-deep">
                                Add Conservation Dive
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
