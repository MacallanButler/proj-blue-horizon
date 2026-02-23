import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Star, Calendar } from "lucide-react";
import { diveSites } from "@/data/mockData";
import DiveSiteCard from "@/components/features/DiveSiteCard";

const Home = () => {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Background Overlay - Would normally be a video or image */}
                <div className="absolute inset-0 bg-ocean-dark z-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay transition-transform duration-[20000ms] hover:scale-105"
                        style={{ backgroundImage: `url('/src/assets/sites/neom-HYHYGLs-Rp8-unsplash.jpg')` }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-ocean-dark via-transparent to-transparent"></div>
                </div>

                <div className="relative z-10 container mx-auto px-6 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 animate-fade-in-up">
                        New: Marine Life Tracking Calendar
                    </span>
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
                            <Link to="/dive-sites">Explore Dive Sites</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base border-slate-600 text-white hover:bg-white/10 hover:text-white">
                            <Link to="/courses">View Courses</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Quick Search Section (Floating) */}
            <div className="relative z-20 -mt-24 container mx-auto px-6">
                <div className="bg-ocean-mid/90 backdrop-blur-lg border border-ocean-light/20 rounded-2xl p-6 shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Destination</label>
                            <div className="flex items-center gap-2 p-3 bg-ocean-dark/50 rounded-lg border border-ocean-light/10 text-slate-200">
                                <MapPin className="h-5 w-5 text-primary" />
                                <span className="text-sm">Raja Ampat, Indonesia</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</label>
                            <div className="flex items-center gap-2 p-3 bg-ocean-dark/50 rounded-lg border border-ocean-light/10 text-slate-200">
                                <Calendar className="h-5 w-5 text-primary" />
                                <span className="text-sm">Nov 12 - Nov 19</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Certification</label>
                            <div className="flex items-center gap-2 p-3 bg-ocean-dark/50 rounded-lg border border-ocean-light/10 text-slate-200">
                                <Star className="h-5 w-5 text-primary" />
                                <span className="text-sm">Open Water Diver</span>
                            </div>
                        </div>
                        <div className="flex items-end">
                            <Button className="w-full h-[46px] bg-primary text-ocean-deep font-bold">
                                Search Dives
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Section Placeholder */}
            <section className="py-24">
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-3xl font-heading font-bold text-white">Featured Expeditions</h2>
                        <a href="#" className="text-primary flex items-center gap-2 text-sm font-medium hover:underline">
                            View all destinations <ArrowRight className="h-4 w-4" />
                        </a>
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
};

export default Home;
