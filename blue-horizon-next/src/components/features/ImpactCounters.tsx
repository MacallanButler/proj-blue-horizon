"use client";

import { useEffect, useRef, useState } from "react";
import { Leaf, Waves, Fish, DollarSign } from "lucide-react";

interface CounterItem {
    icon: React.ElementType;
    label: string;
    value: number;
    suffix: string;
    color: string;
    increment: number; // How much it grows per 50ms tick
}

const COUNTERS: CounterItem[] = [
    { icon: Leaf, label: "Coral Fragments Planted", value: 0, suffix: "", color: "text-teal-400", increment: 7 },
    { icon: Waves, label: "kg CO₂ Offset", value: 0, suffix: " kg", color: "text-blue-400", increment: 3 },
    { icon: Fish, label: "Marine Animals Tagged", value: 0, suffix: "", color: "text-cyan-400", increment: 1 },
    { icon: DollarSign, label: "Conservation Fund Raised", value: 0, suffix: "", color: "text-emerald-400", increment: 23 },
];

// Target "real" values (reached after a few seconds of counting)
const TARGETS = [18423, 9218, 3841, 241720];

function formatValue(n: number, idx: number): string {
    if (idx === 3) return `$${n.toLocaleString()}`; // dollar
    return n.toLocaleString();
}

export function ImpactCounters() {
    const [counts, setCounts] = useState(TARGETS.map(() => 0));
    const started = useRef(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true;
                    const interval = setInterval(() => {
                        setCounts(prev => {
                            const next = prev.map((c, i) => {
                                const speed = Math.ceil((TARGETS[i] - c) * 0.05); // ease-out
                                return Math.min(c + speed, TARGETS[i]);
                            });
                            if (next.every((n, i) => n >= TARGETS[i])) clearInterval(interval);
                            return next;
                        });
                    }, 30);
                }
            },
            { threshold: 0.2 }
        );

        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={containerRef} className="py-20 bg-ocean-dark border-y border-ocean-light/10">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <span className="text-primary font-medium tracking-wide uppercase text-sm block mb-2">Our Impact</span>
                    <h2 className="text-3xl font-heading font-bold text-white">
                        Dive With <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">Purpose</span>
                    </h2>
                    <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
                        2% of every booking goes directly to marine conservation. Updated in real time.
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {COUNTERS.map((counter, i) => (
                        <div
                            key={i}
                            className="bg-ocean-mid/30 border border-ocean-light/10 rounded-xl p-6 text-center backdrop-blur-sm hover:border-primary/30 transition-colors"
                        >
                            <div className={`inline-flex p-3 rounded-xl bg-current/10 mb-4 ${counter.color}`}>
                                <counter.icon className={`w-6 h-6 ${counter.color}`} />
                            </div>
                            <div className={`text-3xl font-heading font-bold mb-1 tabular-nums ${counter.color}`}>
                                {formatValue(counts[i], i)}
                                <span className="text-base">{i !== 3 ? counter.suffix : ""}</span>
                            </div>
                            <p className="text-slate-400 text-xs font-medium">{counter.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
