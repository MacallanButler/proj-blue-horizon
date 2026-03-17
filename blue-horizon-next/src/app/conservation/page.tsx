"use client";

import Link from "next/link";
import { ArrowLeft, Leaf, Fish, Waves, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const initiatives = [
    {
        icon: Waves,
        title: "Reef Restoration",
        description:
            "Our coral gardening program has restored over 500 square meters of damaged reef systems using sustainable transplantation techniques.",
    },
    {
        icon: Fish,
        title: "Marine Wildlife Monitoring",
        description:
            "We track and record marine species populations during every dive, contributing data to global biodiversity databases.",
    },
    {
        icon: Leaf,
        title: "Plastic-Free Operations",
        description:
            "We've eliminated single-use plastics from all our operations and organize monthly beach cleanups with local communities.",
    },
    {
        icon: Heart,
        title: "Community Education",
        description:
            "Free monthly ocean awareness workshops for local schools and communities, educating the next generation of ocean guardians.",
    },
];

export default function ConservationPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-ocean-deep via-ocean-dark to-ocean-deep text-white">
            <div className="container mx-auto px-6 pt-28 pb-16">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Ocean <span className="text-primary">Conservation</span>
                </h1>
                <p className="text-lg text-slate-300 max-w-2xl mb-12">
                    Every dive is an opportunity to protect our oceans. We're
                    committed to preserving marine ecosystems for future
                    generations.
                </p>

                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {initiatives.map((initiative) => {
                        const Icon = initiative.icon;
                        return (
                            <div
                                key={initiative.title}
                                className="bg-ocean-dark/50 backdrop-blur border border-ocean-light/20 rounded-xl p-8 hover:border-primary/40 transition-all"
                            >
                                <Icon className="w-10 h-10 text-primary mb-4" />
                                <h2 className="text-xl font-bold mb-3">
                                    {initiative.title}
                                </h2>
                                <p className="text-slate-300 leading-relaxed">
                                    {initiative.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <div className="bg-primary/10 border border-primary/30 rounded-xl p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">
                        Support Marine Conservation
                    </h2>
                    <p className="text-slate-300 max-w-xl mx-auto mb-8">
                        These organisations are doing the critical work of protecting oceans worldwide. 
                        Every contribution matters — from volunteering to monthly donations.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <a
                            href="https://coralrestoration.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center gap-2 p-5 bg-ocean-dark/60 border border-ocean-light/20 rounded-xl hover:border-primary/50 hover:bg-primary/10 transition-all group"
                        >
                            <Waves className="w-8 h-8 text-primary" />
                            <span className="font-bold text-white group-hover:text-primary transition-colors">Coral Restoration<br/>Foundation</span>
                            <span className="text-xs text-slate-400">Reef regrowth programs</span>
                        </a>
                        <a
                            href="https://seashepherd.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center gap-2 p-5 bg-ocean-dark/60 border border-ocean-light/20 rounded-xl hover:border-primary/50 hover:bg-primary/10 transition-all group"
                        >
                            <Fish className="w-8 h-8 text-primary" />
                            <span className="font-bold text-white group-hover:text-primary transition-colors">Sea Shepherd<br/>Conservation</span>
                            <span className="text-xs text-slate-400">Direct ocean action</span>
                        </a>
                        <a
                            href="https://www.projectaware.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center gap-2 p-5 bg-ocean-dark/60 border border-ocean-light/20 rounded-xl hover:border-primary/50 hover:bg-primary/10 transition-all group"
                        >
                            <Heart className="w-8 h-8 text-primary" />
                            <span className="font-bold text-white group-hover:text-primary transition-colors">Project AWARE<br/>Foundation</span>
                            <span className="text-xs text-slate-400">Diver-led conservation</span>
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
}
