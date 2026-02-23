import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Droplets, Wind, ArrowRight } from "lucide-react";
import { DiveSite } from "@/data/mockData";
import { Button } from "@/components/ui/button";

interface DiveSiteCardProps {
    site: DiveSite;
}

const DiveSiteCard = ({ site }: DiveSiteCardProps) => {
    return (
        <div className="group rounded-xl overflow-hidden bg-ocean-mid border border-ocean-light/20 shadow-lg hover:shadow-2xl hover:border-primary/50 transition-all duration-300 flex flex-col h-full">
            <div className="relative h-48 overflow-hidden">
                <Image
                    src={site.imageUrl}
                    alt={site.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3 bg-ocean-deep/80 backdrop-blur-sm px-2 py-1 rounded-md border border-ocean-light/20 flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-bold text-white">{site.rating}</span>
                </div>
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-ocean-deep to-transparent p-4">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary mb-1">
                        {site.difficulty}
                    </span>
                </div>
            </div>

            <div className="p-5 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-lg font-heading font-bold text-white group-hover:text-primary transition-colors">
                            {site.name}
                        </h3>
                        <div className="flex items-center gap-1 text-slate-400 text-xs mt-1">
                            <MapPin className="w-3 h-3" />
                            <span>{site.location}, {site.country}</span>
                        </div>
                    </div>
                </div>

                <p className="text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">
                    {site.description}
                </p>

                <div className="grid grid-cols-2 gap-2 mb-6">
                    <div className="bg-ocean-dark/50 rounded p-2 border border-ocean-light/10">
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-0.5">
                            <Droplets className="w-3 h-3" />
                            <span>Vis</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-200">{site.visibility.min}-{site.visibility.max}m</span>
                    </div>
                    <div className="bg-ocean-dark/50 rounded p-2 border border-ocean-light/10">
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-0.5">
                            <Wind className="w-3 h-3" />
                            <span>Current</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-200">{site.currentStrength}</span>
                    </div>
                </div>

                <div className="mt-auto">
                    <Link href={`/dive-sites/${site.id}`}>
                        <Button variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary hover:text-ocean-deep group-hover:border-primary">
                            View Details <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DiveSiteCard;
