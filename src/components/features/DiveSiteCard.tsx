import Link from "next/link";
import { Star, MapPin, Droplets, Wind, ArrowRight } from "lucide-react";
import { DiveSite } from "@/data/mockData";

interface DiveSiteCardProps {
    site: DiveSite;
}

const DIFFICULTY_COLOR: Record<string, string> = {
    Beginner: "text-emerald-300 bg-emerald-900/40",
    Intermediate: "text-cyan-300 bg-cyan-900/40",
    Advanced: "text-amber-300 bg-amber-900/40",
    Expert: "text-rose-300 bg-rose-900/40",
};

const DiveSiteCard = ({ site }: DiveSiteCardProps) => {
    const dc = DIFFICULTY_COLOR[site.difficulty] ?? "text-slate-300 bg-slate-700/40";

    return (
        <div className="group rounded-2xl overflow-hidden bg-slate-800/50 border border-slate-700/60 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all duration-300 flex flex-col h-full">
            <div className="relative h-48 overflow-hidden">
                <img
                    src={site.imageUrl}
                    alt={site.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-bold text-white">{site.rating}</span>
                </div>
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-slate-950 to-transparent p-4">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${dc}`}
                        style={{ fontFamily: "system-ui, sans-serif" }}>
                        {site.difficulty}
                    </span>
                </div>
            </div>

            <div className="p-5 flex-grow flex flex-col">
                <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors mb-1">
                    {site.name}
                </h3>
                <div className="flex items-center gap-1 text-slate-500 text-xs mb-3" style={{ fontFamily: "system-ui, sans-serif" }}>
                    <MapPin className="w-3 h-3" />
                    <span>{site.location}, {site.country}</span>
                </div>

                <p className="text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed" style={{ fontFamily: "system-ui, sans-serif" }}>
                    {site.description}
                </p>

                <div className="grid grid-cols-2 gap-2 mb-5">
                    <div className="bg-slate-900/60 rounded-lg p-2 border border-slate-700/40">
                        <div className="flex items-center gap-1.5 text-slate-500 text-[10px] mb-0.5" style={{ fontFamily: "system-ui, sans-serif" }}>
                            <Droplets className="w-3 h-3" /><span>Visibility</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-200" style={{ fontFamily: "system-ui, sans-serif" }}>
                            {site.visibility.min}–{site.visibility.max}m
                        </span>
                    </div>
                    <div className="bg-slate-900/60 rounded-lg p-2 border border-slate-700/40">
                        <div className="flex items-center gap-1.5 text-slate-500 text-[10px] mb-0.5" style={{ fontFamily: "system-ui, sans-serif" }}>
                            <Wind className="w-3 h-3" /><span>Current</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-200" style={{ fontFamily: "system-ui, sans-serif" }}>
                            {site.currentStrength}
                        </span>
                    </div>
                </div>

                <div className="mt-auto">
                    <Link
                        href={`/dive-sites/${site.id}`}
                        className="flex items-center justify-center gap-2 w-full text-xs font-semibold px-4 py-2 rounded-full bg-cyan-400/10 text-cyan-400 border border-cyan-400/30 hover:bg-cyan-400 hover:text-slate-900 transition-all duration-200"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        View Details <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DiveSiteCard;