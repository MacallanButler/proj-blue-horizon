import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { diveSites } from "@/data/mockData";
import DiveSiteCard from "@/components/features/DiveSiteCard";

export default function Home() {
    return (
        <div className="flex flex-col">
            {/* Hero */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0" style={{ background: "#020d18" }}>
                    <div
                        className="absolute inset-0 opacity-75 transition-transform hover:scale-105 z-0"
                        style={{ transitionDuration: "20000ms" }}
                    >
                        <Image
                            src="/assets/sites/neom-HYHYGLs-Rp8-unsplash.jpg"
                            alt="Blue Horizon underwater banner"
                            fill
                            priority
                            sizes="100vw"
                            className="object-cover"
                        />
                    </div>
                    <div className="absolute inset-0 bg-slate-950/40 z-0" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                </div>

                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.025] z-0"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(100,220,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(100,220,255,1) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />

                <div className="relative z-10 container mx-auto px-6 text-center">
                    <p
                        className="text-cyan-400 text-xs uppercase tracking-[0.3em] font-semibold mb-6 animate-fade-in-up delay-100"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        Blue Horizon Dive Shop
                    </p>
                    <h1
                        className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-up delay-100"
                        style={{ letterSpacing: "-0.02em" }}
                    >
                        Dive Into the <br />
                        <span
                            className="text-transparent bg-clip-text"
                            style={{ backgroundImage: "linear-gradient(90deg, #22d3ee, #0ea5e9)" }}
                        >
                            Deep Unknown
                        </span>
                    </h1>
                    <p
                        className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        Experience the world's most breathtaking underwater destinations with
                        unmatched safety, transparency, and conservation focus.
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
                        <Link
                            href="/dive-sites"
                            className="bg-cyan-400 text-slate-900 font-bold px-8 py-3 rounded-full text-base hover:bg-cyan-300 transition-colors duration-200"
                            style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                            Explore Dive Sites
                        </Link>
                        <Link
                            href="/courses"
                            className="border border-slate-600 text-white font-semibold px-8 py-3 rounded-full text-base hover:border-slate-400 hover:bg-white/5 transition-all duration-200"
                            style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                            View Courses
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Sites */}
            <section className="py-24">
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <p
                                className="text-cyan-400 text-xs uppercase tracking-[0.3em] font-semibold mb-2"
                                style={{ fontFamily: "system-ui, sans-serif" }}
                            >
                                Hand-picked
                            </p>
                            <h2 className="text-3xl font-bold text-white">Featured Expeditions</h2>
                        </div>
                        <Link
                            href="/dive-sites"
                            className="text-slate-400 hover:text-cyan-400 flex items-center gap-2 text-sm font-medium transition-colors"
                            style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                            View all <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {diveSites.slice(0, 3).map((site) => (
                            <DiveSiteCard key={site.id} site={site} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Conservation strip */}
            <section className="border-t border-slate-800/60 py-16">
                <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Dive with purpose.</h3>
                        <p className="text-slate-400 text-sm max-w-md" style={{ fontFamily: "system-ui, sans-serif" }}>
                            Every booking contributes to marine park maintenance. Join our conservation events — cleanups, reef surveys, and more.
                        </p>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        <Link
                            href="/conservation"
                            className="bg-cyan-400 text-slate-900 font-bold text-sm px-6 py-3 rounded-full hover:bg-cyan-300 transition-colors duration-200"
                            style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                            See conservation events →
                        </Link>
                        <Link
                            href="/courses"
                            className="border border-slate-600 text-slate-300 font-semibold text-sm px-6 py-3 rounded-full hover:border-slate-400 hover:text-white transition-all duration-200"
                            style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                            Browse courses
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}