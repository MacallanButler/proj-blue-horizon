import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Star, Calendar } from "lucide-react";
import { diveSites } from "@/data/mockData";
import DiveSiteCard from "@/components/features/DiveSiteCard";

export default function Home() {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Background Overlay - Would normally be a video or image */}
                <div className="absolute inset-0 bg-ocean-dark z-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay transition-transform duration-[20000ms] hover:scale-105"
                        style={{ backgroundImage: `url('/assets/sites/neom-HYHYGLs-Rp8-unsplash.jpg')` }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-ocean-dark via-transparent to-transparent"></div>
                </div>

                <div className="relative z-10 container mx-auto px-6 text-center">
                    <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 leading-tight animate-fade-in-up delay-100">
                        Dive Into the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                            Deep Unknown
                        </span>
                    </h1>
                    <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200">
                        Experience the world's most breathtaking underwater destinations with
                        unmatched safety, transparency, and conservation focus.
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
                        <Button asChild size="lg" className="bg-primary text-ocean-deep font-bold h-12 px-8 text-base">
                            <Link href="/dive-sites">Explore Dive Sites</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base border-slate-600 text-white hover:bg-white/10 hover:text-white">
                            <Link href="/courses">View Courses</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Featured Section Placeholder */}
            <section className="py-24">
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-3xl font-heading font-bold text-white">Featured Expeditions</h2>
                        <Link href="#" className="text-primary flex items-center gap-2 text-sm font-medium hover:underline">
                            View all destinations <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Display top 3 rated sites */}
                        {diveSites.slice(0, 3).map((site) => (
                            <DiveSiteCard key={site.id} site={site} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
