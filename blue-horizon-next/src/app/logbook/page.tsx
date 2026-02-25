"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Thermometer, Eye, Calendar } from "lucide-react";

interface LogEntry {
    id: number;
    site: string;
    date: string;
    depth: string;
    duration: string;
    waterTemp: string;
    visibility: string;
    highlights: string;
}

const sampleLogs: LogEntry[] = [
    {
        id: 1,
        site: "Blue Hole",
        date: "2026-01-15",
        depth: "40m",
        duration: "45 min",
        waterTemp: "26°C",
        visibility: "30m",
        highlights:
            "Incredible stalactite formations. Spotted bull sharks circling at depth. Clear visibility all the way down.",
    },
    {
        id: 2,
        site: "Coral Gardens",
        date: "2026-01-12",
        depth: "18m",
        duration: "55 min",
        waterTemp: "28°C",
        visibility: "25m",
        highlights:
            "Beautiful staghorn coral fields. Encountered a green sea turtle resting. Perfect conditions for underwater photography.",
    },
    {
        id: 3,
        site: "The Wall",
        date: "2026-01-08",
        depth: "30m",
        duration: "50 min",
        waterTemp: "27°C",
        visibility: "35m",
        highlights:
            "Dramatic drop-off with sponge gardens. Eagle ray flyby at 25m. Strong current on the south end.",
    },
];

export default function LogbookPage() {
    const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

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
                    Dive <span className="text-primary">Logbook</span>
                </h1>
                <p className="text-lg text-slate-300 max-w-2xl mb-12">
                    Track your underwater adventures. Every dive tells a story —
                    record yours here.
                </p>

                <div className="grid lg:grid-cols-3 gap-6">
                    {sampleLogs.map((log) => (
                        <button
                            key={log.id}
                            onClick={() => setSelectedLog(log)}
                            className={`text-left bg-ocean-dark/50 backdrop-blur border rounded-xl p-6 transition-all ${selectedLog?.id === log.id
                                    ? "border-primary"
                                    : "border-ocean-light/20 hover:border-primary/40"
                                }`}
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span className="font-bold">{log.site}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-slate-400 mb-2">
                                <Calendar className="w-3 h-3" />
                                {log.date}
                            </div>
                            <div className="flex gap-4 text-xs text-slate-400">
                                <span>{log.depth}</span>
                                <span>{log.duration}</span>
                            </div>
                        </button>
                    ))}
                </div>

                {selectedLog && (
                    <div className="mt-8 bg-ocean-dark/50 backdrop-blur border border-primary/30 rounded-xl p-8">
                        <h2 className="text-2xl font-bold mb-4">
                            {selectedLog.site}
                        </h2>
                        <div className="grid sm:grid-cols-3 gap-4 mb-6">
                            <div className="flex items-center gap-2 text-slate-300">
                                <Thermometer className="w-4 h-4 text-primary" />
                                Water: {selectedLog.waterTemp}
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                                <Eye className="w-4 h-4 text-primary" />
                                Visibility: {selectedLog.visibility}
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                                <Calendar className="w-4 h-4 text-primary" />
                                {selectedLog.date}
                            </div>
                        </div>
                        <p className="text-slate-300 leading-relaxed">
                            {selectedLog.highlights}
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
