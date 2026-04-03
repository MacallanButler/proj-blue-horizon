"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Check, ArrowRight, ArrowLeft, MapPin, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PricingSummary from "@/components/features/PricingSummary";

const steps = ["Dates & Location", "Equipment", "Details", "Review"];

const availableGear = [
    { id: "bcd", name: "BCD (Buoyancy Control Device)", price: 15 },
    { id: "reg", name: "Regulator Set", price: 15 },
    { id: "wetsuit", name: "Wetsuit (3mm/5mm)", price: 10 },
    { id: "mask-fins", name: "Mask & Fins", price: 10 },
    { id: "computer", name: "Dive Computer", price: 15 },
];

const availableExtras = [
    { id: "nitrox", name: "Nitrox Tank Upgrade", price: 12 },
    { id: "photo", name: "Underwater Photographer", price: 150 },
    { id: "guide", name: "Private Guide", price: 100 },
];

export default function Booking() {
    const [currentStep, setCurrentStep] = useState(0);
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [selectedGear, setSelectedGear] = useState<string[]>([]);
    const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
    const [experienceLevel, setExperienceLevel] = useState("Open Water");

    const handleGearToggle = (id: string) => {
        setSelectedGear((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
    };
    const handleExtrasToggle = (id: string) => {
        setSelectedExtras((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
    };

    const getGearItems = () => availableGear.filter((g) => selectedGear.includes(g.id)).map((g) => ({ name: g.name, cost: g.price }));
    const getExtraItems = () => availableExtras.filter((e) => selectedExtras.includes(e.id)).map((e) => ({ name: e.name, cost: e.price }));

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

    return (
        <div className="min-h-screen pb-20">
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.025]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(100,220,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(100,220,255,1) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />

            <div className="relative container mx-auto px-6 max-w-6xl pt-32">
                <p className="text-cyan-400 text-xs uppercase tracking-[0.3em] font-semibold mb-4" style={{ fontFamily: "system-ui, sans-serif" }}>
                    Blue Horizon Dive Shop
                </p>
                <h1 className="text-5xl font-bold text-white mb-2" style={{ letterSpacing: "-0.02em" }}>Book Your Dive</h1>
                <p className="text-slate-400 mb-12 text-lg" style={{ fontFamily: "system-ui, sans-serif" }}>
                    Secure your spot for an unforgettable underwater adventure.
                </p>

                {/* Step indicator */}
                <div className="flex items-center justify-between relative mb-16 max-w-3xl mx-auto">
                    <div className="absolute left-0 top-5 w-full h-px bg-slate-700/60 -z-10" />
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center gap-2">
                            <div
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold transition-all duration-300",
                                    index <= currentStep
                                        ? "bg-cyan-400 border-cyan-400 text-slate-900"
                                        : "bg-slate-950 border-slate-600 text-slate-500"
                                )}
                                style={{ fontFamily: "system-ui, sans-serif" }}
                            >
                                {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
                            </div>
                            <span
                                className={cn(
                                    "text-[10px] font-semibold uppercase tracking-wider",
                                    index <= currentStep ? "text-cyan-400" : "text-slate-600"
                                )}
                                style={{ fontFamily: "system-ui, sans-serif" }}
                            >
                                {step}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 bg-slate-800/50 p-8 rounded-2xl border border-slate-700/60">

                        {currentStep === 0 && (
                            <div className="space-y-6">
                                <div className="border-b border-slate-700/60 pb-4 mb-6">
                                    <h2 className="text-2xl font-bold text-white">Dates & Location</h2>
                                    <p className="text-slate-400 mt-1 text-sm" style={{ fontFamily: "system-ui, sans-serif" }}>
                                        Choose your destination, preferred dates, and experience level.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-slate-900/60 p-6 rounded-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="bg-cyan-400/10 p-2 rounded-lg text-cyan-400">
                                                <MapPin className="w-5 h-5" />
                                            </div>
                                            <label className="text-base font-semibold text-slate-200">Destination</label>
                                        </div>
                                        <Select defaultValue="blue-corner">
                                            <SelectTrigger className="w-full bg-slate-800 border-slate-600 text-white h-12">
                                                <SelectValue placeholder="Select a site" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-slate-700 text-white">
                                                <SelectItem value="blue-corner">Blue Corner, Palau</SelectItem>
                                                <SelectItem value="yongala">SS Yongala, Australia</SelectItem>
                                                <SelectItem value="blue-hole">Great Blue Hole, Belize</SelectItem>
                                                <SelectItem value="manta-point">Manta Point, Indonesia</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="bg-slate-900/60 p-6 rounded-xl border border-blue-400/20 hover:border-blue-400/40 transition-colors">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="bg-blue-400/10 p-2 rounded-lg text-blue-400">
                                                <CalendarIcon className="w-5 h-5" />
                                            </div>
                                            <label className="text-base font-semibold text-slate-200">Date</label>
                                        </div>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button
                                                    className={cn(
                                                        "w-full flex items-center justify-start text-left px-3 h-12 rounded-lg bg-slate-800 border border-slate-600 text-sm transition-colors hover:border-slate-400",
                                                        !date && "text-slate-500"
                                                    )}
                                                    style={{ fontFamily: "system-ui, sans-serif" }}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4 text-blue-400/70" />
                                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-700 shadow-2xl">
                                                <Calendar
                                                    mode="single"
                                                    selected={date}
                                                    onSelect={setDate}
                                                    initialFocus
                                                    className="text-white rounded-md"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>

                                <div className="bg-slate-900/60 p-6 rounded-xl border border-teal-400/20 hover:border-teal-400/40 transition-colors">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="bg-teal-400/10 p-2 rounded-lg text-teal-400">
                                            <Star className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <label className="block text-base font-semibold text-slate-200">Experience Level</label>
                                            <span className="text-xs text-slate-500" style={{ fontFamily: "system-ui, sans-serif" }}>
                                                Helps us match you with the right dive master.
                                            </span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {["Open Water", "Advanced", "Rescue/Master"].map((level) => (
                                            <button
                                                key={level}
                                                onClick={() => setExperienceLevel(level)}
                                                className={cn(
                                                    "flex items-center gap-3 border p-4 rounded-xl transition-all",
                                                    experienceLevel === level
                                                        ? "border-teal-400/60 bg-teal-400/10"
                                                        : "border-slate-700/60 bg-slate-800/40 hover:border-slate-600"
                                                )}
                                                style={{ fontFamily: "system-ui, sans-serif" }}
                                            >
                                                <div className={cn(
                                                    "h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0",
                                                    experienceLevel === level ? "border-teal-400" : "border-slate-600"
                                                )}>
                                                    {experienceLevel === level && <div className="w-2 h-2 bg-teal-400 rounded-full" />}
                                                </div>
                                                <span className="text-sm font-medium text-slate-200">{level}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 1 && (
                            <div className="space-y-8">
                                <div className="border-b border-slate-700/60 pb-4 mb-2">
                                    <h2 className="text-2xl font-bold text-white">Equipment Rental</h2>
                                    <p className="text-slate-400 text-sm mt-1" style={{ fontFamily: "system-ui, sans-serif" }}>
                                        Select the gear you need. All equipment is serviced regularly.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    {availableGear.map((item) => (
                                        <div
                                            key={item.id}
                                            className={cn(
                                                "flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer",
                                                selectedGear.includes(item.id)
                                                    ? "bg-cyan-400/10 border-cyan-400/40"
                                                    : "bg-slate-900/40 border-slate-700/40 hover:border-slate-600/60"
                                            )}
                                            onClick={() => handleGearToggle(item.id)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Checkbox
                                                    checked={selectedGear.includes(item.id)}
                                                    className="border-slate-500 data-[state=checked]:bg-cyan-400 data-[state=checked]:text-slate-900"
                                                />
                                                <span className="text-slate-200 font-medium text-sm" style={{ fontFamily: "system-ui, sans-serif" }}>
                                                    {item.name}
                                                </span>
                                            </div>
                                            <span className="text-cyan-400 font-bold text-sm">${item.price}</span>
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-white mb-3">Add-ons</h3>
                                    <div className="space-y-3">
                                        {availableExtras.map((item) => (
                                            <div
                                                key={item.id}
                                                className={cn(
                                                    "flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer",
                                                    selectedExtras.includes(item.id)
                                                        ? "bg-cyan-400/10 border-cyan-400/40"
                                                        : "bg-slate-900/40 border-slate-700/40 hover:border-slate-600/60"
                                                )}
                                                onClick={() => handleExtrasToggle(item.id)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Checkbox
                                                        checked={selectedExtras.includes(item.id)}
                                                        className="border-slate-500 data-[state=checked]:bg-cyan-400 data-[state=checked]:text-slate-900"
                                                    />
                                                    <span className="text-slate-200 font-medium text-sm" style={{ fontFamily: "system-ui, sans-serif" }}>
                                                        {item.name}
                                                    </span>
                                                </div>
                                                <span className="text-cyan-400 font-bold text-sm">${item.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep >= 2 && (
                            <div className="text-center py-20">
                                <p className="text-slate-400 text-sm" style={{ fontFamily: "system-ui, sans-serif" }}>
                                    Step {currentStep + 1}: {steps[currentStep]} — coming soon.
                                </p>
                            </div>
                        )}

                        <div className="flex justify-between mt-12 pt-8 border-t border-slate-700/40">
                            <button
                                onClick={prevStep}
                                disabled={currentStep === 0}
                                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors disabled:opacity-30 text-sm font-medium"
                                style={{ fontFamily: "system-ui, sans-serif" }}
                            >
                                <ArrowLeft className="h-4 w-4" /> Back
                            </button>
                            <button
                                onClick={nextStep}
                                className="flex items-center gap-2 bg-cyan-400 text-slate-900 font-bold text-sm px-8 py-2.5 rounded-full hover:bg-cyan-300 transition-colors duration-200"
                                style={{ fontFamily: "system-ui, sans-serif" }}
                            >
                                {currentStep === steps.length - 1 ? "Confirm Booking" : "Next Step"}
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-28">
                            <PricingSummary
                                basePrice={150}
                                gearItems={getGearItems()}
                                extras={getExtraItems()}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}