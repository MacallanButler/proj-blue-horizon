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
                        Join Our Conservation Efforts
                    </h2>
                    <p className="text-slate-300 max-w-xl mx-auto mb-6">
                        Whether you're a certified diver or just passionate
                        about the ocean, there's a place for you in our
                        conservation programs.
                    </p>
                    <Button
                        asChild
                        className="bg-primary text-ocean-deep hover:bg-primary/90 font-bold"
                    >
                        <Link href="/booking">Get Involved</Link>
                    </Button>
                </div>
            </div>
        </main>
    );
}
