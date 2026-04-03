"use client";

import { useState } from "react";
import { diveSites } from "@/data/mockData";
import DiveSiteCard from "@/components/features/DiveSiteCard";

const FILTERS = ["All", "Beginner", "Intermediate", "Advanced", "Expert"];

export default function DiveSites() {
    const [active, setActive] = useState("All");
    const filtered = active === "All" ? diveSites : diveSites.filter((s) => s.difficulty === active);

    return (
        <div className="min-h-screen pb-20">
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.025]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(100,220,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(100,220,255,1) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />

            <div className="relative container mx-auto px-6 pt-32">
                <div className="mb-12">
                    <h1
                        className="text-5xl md:text-6xl font-bold text-white mb-4"
                        style={{ letterSpacing: "-0.02em" }}
                    >
                        Explore{" "}
                        <span
                            className="text-transparent bg-clip-text"
                            style={{ backgroundImage: "linear-gradient(90deg, #22d3ee, #0ea5e9)" }}
                        >
                            Dive Sites
                        </span>
                    </h1>
                    <p className="text-slate-400 max-w-xl text-lg" style={{ fontFamily: "system-ui, sans-serif" }}>
                        Discover the world's most incredible underwater destinations. Filter by difficulty to find your perfect dive.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 mb-10">
                    {FILTERS.map((f) => (
                        <button
                            key={f}
                            onClick={() => setActive(f)}
                            style={{ fontFamily: "system-ui, sans-serif" }}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-200 border ${
                                active === f
                                    ? "bg-cyan-400 text-slate-900 border-cyan-400"
                                    : "bg-transparent text-slate-400 border-slate-600 hover:border-slate-400 hover:text-slate-200"
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filtered.map((site) => (
                        <DiveSiteCard key={site.id} site={site} />
                    ))}
                </div>
            </div>
        </div>
    );
}