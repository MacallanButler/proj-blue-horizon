"use client";

import { useEffect, useRef, useState } from "react";
import { Leaf, Waves, Fish, DollarSign } from "lucide-react";
import { apiClient } from "@/lib/apiClient";

interface CounterItem {
  icon: React.ElementType;
  label: string;
  suffix: string;
  color: string;
}

const COUNTERS: CounterItem[] = [
  { icon: Leaf, label: "Coral Fragments Planted", suffix: "", color: "text-teal-400" },
  { icon: Waves, label: "kg CO₂ Offset", suffix: " kg", color: "text-blue-400" },
  { icon: Fish, label: "Marine Animals Tagged", suffix: "", color: "text-cyan-400" },
  { icon: DollarSign, label: "Conservation Fund Raised", suffix: "", color: "text-emerald-400" },
];

function formatValue(n: number, idx: number): string {
  if (idx === 3) return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  return n.toLocaleString();
}

export default function ImpactCounters() {
  const [targets, setTargets] = useState<number[]>([0, 0, 0, 0]);
  const [counts, setCounts] = useState([0, 0, 0, 0]);
  const started = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch real statistics from database on mount
  useEffect(() => {
    apiClient.getImpactStats()
      .then((stats) => {
        if (stats) {
          setTargets([
            stats.coralFragmentsPlanted || 0,
            stats.co2OffsetKg || 0,
            stats.marineAnimalsTagged || 0,
            Math.round((stats.conservationFundCents || 0) / 100) // Convert cents to dollars
          ]);
        }
      })
      .catch((err) => {
        console.error("Failed to load impact stats, using default values.", err);
        setTargets([420, 180, 85, 230]); // fallback dev stats
      });
  }, []);

  useEffect(() => {
    // Wait until targets are loaded (non-zero or loaded)
    if (targets.every(t => t === 0)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const interval = setInterval(() => {
            setCounts((prev) => {
              const next = prev.map((c, i) => {
                const diff = targets[i] - c;
                if (diff <= 0) return targets[i];
                const speed = Math.ceil(diff * 0.08); // ease-out count speed
                return Math.min(c + speed, targets[i]);
              });
              if (next.every((n, i) => n >= targets[i])) {
                clearInterval(interval);
              }
              return next;
            });
          }, 30);
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [targets]);

  return (
    <section ref={containerRef} className="py-20 bg-ocean-deep/80 border-y border-ocean-light/10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-primary font-medium tracking-wide uppercase text-sm block mb-2">Our Impact</span>
          <h2 className="text-3xl font-heading font-bold text-white">
            Dive With <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">Purpose</span>
          </h2>
          <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
            $10 from every booking goes directly to marine conservation. Updated in real time.
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
