import { diveSites } from "@/data/mockData";
import DiveSiteCard from "@/components/features/DiveSiteCard";
import { Button } from "@/components/ui/button";

export default function DiveSitesPage() {
    return (
        <div className="pt-24 min-h-screen pb-20">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
                            Explore Dive Sites
                        </h1>
                        <p className="text-slate-400 max-w-xl text-lg">
                            Discover the world's most incredible underwater destinations.
                            Filter by difficulty, wildlife, or depth to find your perfect dive.
                        </p>
                    </div>
                </div>

                {/* Filters Placeholder */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {["All Difficulties", "Beginner", "Advanced", "Wreck", "Reef"].map((filter, i) => (
                        <Button key={i} variant="outline" size="sm"
                            className={`border-ocean-light/20 text-slate-300 hover:text-white hover:border-primary/50 ${i === 0 ? 'bg-primary/10 border-primary/50 text-white' : 'bg-transparent'}`}>
                            {filter}
                        </Button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {diveSites.map((site) => (
                        <DiveSiteCard key={site.id} site={site} />
                    ))}
                </div>
            </div>
        </div>
    );
}
