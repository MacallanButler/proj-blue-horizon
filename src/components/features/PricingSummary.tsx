import { Separator } from "@/components/ui/separator";

interface PricingItem {
    name: string;
    cost: number;
    details?: string;
}

interface PricingSummaryProps {
    basePrice: number;
    gearItems: PricingItem[];
    extras: PricingItem[];
}

const PricingSummary = ({ basePrice, gearItems, extras }: PricingSummaryProps) => {
    const gearTotal = gearItems.reduce((acc, item) => acc + item.cost, 0);
    const extrasTotal = extras.reduce((acc, item) => acc + item.cost, 0);
    const subtotal = basePrice + gearTotal + extrasTotal;
    const fees = Math.round(subtotal * 0.05);
    const total = subtotal + fees;

    return (
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/60">
            <h3 className="text-xl font-bold text-white mb-6">Pricing Breakdown</h3>

            <div className="space-y-4">
                <div className="flex justify-between items-center text-slate-200">
                    <div>
                        <span className="font-semibold block">2-Tank Boat Dive</span>
                        <span className="text-xs text-slate-500" style={{ fontFamily: "system-ui, sans-serif" }}>
                            Includes boat, weights & guide
                        </span>
                    </div>
                    <span className="font-bold">${basePrice}</span>
                </div>

                <Separator className="bg-slate-700/60" />

                {gearItems.length > 0 && (
                    <div className="space-y-2">
                        <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider" style={{ fontFamily: "system-ui, sans-serif" }}>
                            Equipment Rental
                        </span>
                        {gearItems.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm text-slate-300" style={{ fontFamily: "system-ui, sans-serif" }}>
                                <span>{item.name}</span>
                                <span>${item.cost}</span>
                            </div>
                        ))}
                    </div>
                )}

                {extras.length > 0 && (
                    <div className="space-y-2">
                        <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider" style={{ fontFamily: "system-ui, sans-serif" }}>
                            Add-ons
                        </span>
                        {extras.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm text-slate-300" style={{ fontFamily: "system-ui, sans-serif" }}>
                                <span>{item.name}</span>
                                <span>${item.cost}</span>
                            </div>
                        ))}
                    </div>
                )}

                <Separator className="bg-slate-700/60" />

                <div className="flex justify-between text-sm text-slate-400" style={{ fontFamily: "system-ui, sans-serif" }}>
                    <span>Marine Park & Service Fee (5%)</span>
                    <span>${fees}</span>
                </div>

                <div className="flex justify-between items-end pt-4 border-t border-slate-700/60">
                    <span className="text-lg font-bold text-white">Total</span>
                    <span className="text-2xl font-bold text-cyan-400">${total}</span>
                </div>

                <p className="text-[10px] text-slate-600 text-center pt-2" style={{ fontFamily: "system-ui, sans-serif" }}>
                    A portion of every booking goes directly to marine conservation via our Dive with Purpose fund.
                </p>
            </div>
        </div>
    );
};

export default PricingSummary;