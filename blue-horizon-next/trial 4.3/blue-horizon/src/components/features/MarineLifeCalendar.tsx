import { cn } from "@/lib/utils";

interface MarineLifeCalendarProps {
    bestMonths: number[]; // 0-11
}

const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

const MarineLifeCalendar = ({ bestMonths }: MarineLifeCalendarProps) => {
    return (
        <div className="bg-ocean-dark/30 rounded-xl p-6 border border-ocean-light/10 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-white mb-4">Marine Life Likelihood</h3>
            <div className="flex justify-between items-end h-32 gap-2">
                {months.map((month, index) => {
                    const isBest = bestMonths.includes(index);
                    // Simulate likelihood randomly if it's a best month (80-100), otherwise (0-30)
                    const height = isBest ? Math.random() * 40 + 60 : Math.random() * 20 + 10;

                    return (
                        <div key={index} className="flex flex-col items-center gap-2 flex-1 group relative">
                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-ocean-deep text-xs text-white p-1 rounded whitespace-nowrap z-10 pointer-events-none">
                                {Math.round(height)}% Chance
                            </div>
                            <div
                                className={cn(
                                    "w-full rounded-t-sm transition-all duration-500",
                                    isBest ? "bg-primary animate-pulse-slow" : "bg-ocean-light/30"
                                )}
                                style={{ height: `${height}%` }}
                            ></div>
                            <span className={cn("text-xs font-semibold", isBest ? "text-primary" : "text-slate-500")}>
                                {month}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MarineLifeCalendar;
