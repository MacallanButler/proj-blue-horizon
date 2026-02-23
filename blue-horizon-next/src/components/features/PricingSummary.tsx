
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
    const fees = Math.round(subtotal * 0.05); // 5% service/conservation fee
    const total = subtotal + fees;

    return (
        <div className="bg-ocean-mid/30 rounded-xl p-6 border border-ocean-light/20 backdrop-blur-md">
            <h3 className="text-xl font-heading font-bold text-white mb-4">Pricing Transparency</h3>

            <div className="space-y-4">
                {/* Base Dive */}
                <div className="flex justify-between items-center text-slate-200">
                    <div>
                        <span className="font-semibold block">2-Tank Boat Dive</span>
                        <span className="text-xs text-slate-400">Includes boat trip, weights, and guide</span>
                    </div>
                    <span className="font-bold">${basePrice}</span>
                </div>

                <Separator className="bg-ocean-light/10" />

                {/* Gear */}
                {gearItems.length > 0 && (
                    <div className="space-y-2">
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">Equipment Rental</span>
                        {gearItems.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm text-slate-300">
                                <span>{item.name}</span>
                                <span>${item.cost}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Extras */}
                {extras.length > 0 && (
                    <div className="space-y-2 mt-4">
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">Add-ons</span>
                        {extras.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm text-slate-300">
                                <span>{item.name}</span>
                                <span>${item.cost}</span>
                            </div>
                        ))}
                    </div>
                )}

                <Separator className="bg-ocean-light/10 my-4" />

                <div className="flex justify-between text-sm text-slate-400">
                    <span>Marine Park & Service Fees (5%)</span>
                    <span>${fees}</span>
                </div>

                <div className="flex justify-between items-end mt-2 pt-4 border-t border-ocean-light/20">
                    <span className="text-lg font-bold text-white">Total</span>
                    <span className="text-2xl font-bold text-primary">${total}</span>
                </div>

                <p className="text-[10px] text-slate-500 mt-4 text-center">
                    * 2% of every booking goes directly to marine conservation efforts via our "Dive with Purpose" fund.
                </p>
            </div>
        </div>
    );
};

export default PricingSummary;
