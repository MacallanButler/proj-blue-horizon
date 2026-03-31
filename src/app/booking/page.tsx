"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Check, ArrowRight, ArrowLeft, MapPin, Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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

    const handleGearToggle = (id: string) => {
        setSelectedGear(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleExtrasToggle = (id: string) => {
        setSelectedExtras(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const getGearItems = () => availableGear.filter(g => selectedGear.includes(g.id)).map(g => ({ name: g.name, cost: g.price }));
    const getExtraItems = () => availableExtras.filter(e => selectedExtras.includes(e.id)).map(e => ({ name: e.name, cost: e.price }));

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

    return (
        <div className="pt-24 pb-20 min-h-screen bg-ocean-dark">
            <div className="container mx-auto px-6 max-w-6xl">
                <h1 className="text-4xl font-heading font-bold text-white mb-2">Book Your Dive</h1>
                <p className="text-slate-400 mb-12">Secure your spot for an unforgettable underwater adventure.</p>

                {/* Steps Indicator */}
                <div className="flex items-center justify-between relative mb-16 max-w-3xl mx-auto">
                    <div className="absolute left-0 top-1/2 w-full h-0.5 bg-ocean-light/20 -z-10"></div>
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center gap-2 bg-ocean-dark">
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold transition-all duration-300",
                                index <= currentStep
                                    ? "bg-primary border-primary text-ocean-deep"
                                    : "bg-ocean-dark border-slate-600 text-slate-500"
                            )}>
                                {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
                            </div>
                            <span className={cn(
                                "text-xs font-medium uppercase tracking-wider",
                                index <= currentStep ? "text-primary" : "text-slate-600"
                            )}>{step}</span>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Form Section */}
                    <div className="lg:col-span-2 bg-ocean-mid/30 p-8 rounded-2xl border border-ocean-light/20 shadow-[0_0_40px_rgba(45,212,191,0.06)] ring-1 ring-teal-400/10">
                        {currentStep === 0 && (
                            <div className="space-y-6 animate-fade-in-up">
                                <div className="border-b border-ocean-light/20 pb-4 mb-6">
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">Dates & Location</h2>
                                    <p className="text-slate-400 mt-2 text-sm">Choose your destination, preferred dates, and detail your required level of experience.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Dive Site Block */}
                                    <div className="bg-ocean-dark/60 p-6 rounded-xl border border-primary/20 shadow-[0_0_15px_rgba(28,216,210,0.03)] relative overflow-hidden group hover:border-primary/40 transition-colors">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-12 -mt-12 transition-all group-hover:bg-primary/10"></div>
                                        <div className="space-y-4 relative z-10">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="bg-primary/20 p-2 rounded-lg text-primary">
                                                    <MapPin className="w-5 h-5" />
                                                </div>
                                                <label className="text-base font-semibold text-slate-200">Destination</label>
                                            </div>
                                            <Select defaultValue="blue-corner">
                                                <SelectTrigger className="w-full bg-ocean-mid/80 border-ocean-light/30 text-white h-12 focus:ring-primary/50">
                                                    <SelectValue placeholder="Select a site" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-ocean-dark border-ocean-light/20 text-white shadow-xl">
                                                    <SelectItem value="blue-corner">Blue Corner, Palau</SelectItem>
                                                    <SelectItem value="yongala">SS Yongala, Australia</SelectItem>
                                                    <SelectItem value="blue-hole">Great Blue Hole, Belize</SelectItem>
                                                    <SelectItem value="manta-point">Manta Point, Indonesia</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Date Block */}
                                    <div className="bg-ocean-dark/60 p-6 rounded-xl border border-blue-400/20 shadow-[0_0_15px_rgba(96,165,250,0.03)] relative overflow-hidden group hover:border-blue-400/40 transition-colors">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/5 rounded-full blur-2xl -mr-12 -mt-12 transition-all group-hover:bg-blue-400/10"></div>
                                        <div className="space-y-4 relative z-10">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="bg-blue-400/20 p-2 rounded-lg text-blue-400">
                                                    <CalendarIcon className="w-5 h-5" />
                                                </div>
                                                <label className="text-base font-semibold text-slate-200">Date Range</label>
                                            </div>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal bg-ocean-mid/80 border-ocean-light/30 hover:bg-ocean-light/20 hover:text-white h-12 transition-colors",
                                                            !date && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4 text-blue-400/70" />
                                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 bg-ocean-mid border-ocean-light/20 shadow-2xl">
                                                    <Calendar
                                                        mode="single"
                                                        selected={date}
                                                        onSelect={setDate}
                                                        initialFocus
                                                        className="text-white bg-ocean-dark rounded-md"
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>
                                </div>

                                {/* Experience Block */}
                                <div className="bg-ocean-dark/60 p-6 rounded-xl border border-teal-400/20 shadow-[0_0_15px_rgba(45,212,191,0.03)] relative overflow-hidden mt-2 group hover:border-teal-400/40 transition-colors">
                                     <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/5 rounded-full blur-3xl -mr-24 -mt-24 transition-all group-hover:bg-teal-400/10"></div>
                                     <div className="space-y-5 relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-teal-400/20 p-2 rounded-lg text-teal-400">
                                                <Star className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <label className="block text-base font-semibold text-slate-200">Current Experience Level</label>
                                                <span className="text-xs text-slate-400 block mt-0.5">This helps us match you with the right dive masters.</span>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            {["Open Water", "Advanced", "Rescue/Master"].map((level, i) => (
                                                <div key={level} className="flex items-center space-x-3 border border-ocean-light/20 p-4 rounded-xl bg-ocean-mid/40 hover:bg-ocean-mid/80 hover:border-teal-400/50 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg">
                                                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${i === 0 ? 'border-teal-400 bg-teal-400/10' : 'border-slate-500'}`}>
                                                        {i === 0 && <div className="w-2 h-2 bg-teal-400 rounded-full" />}
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-200">{level}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 1 && (
                            <div className="space-y-8 animate-fade-in-up">
                                <h2 className="text-2xl font-bold text-white">Equipment Rental</h2>
                                <p className="text-slate-400 text-sm">Select the gear you need. All our equipment is serviced regularly.</p>

                                <div className="space-y-4">
                                    {availableGear.map((item) => (
                                        <div key={item.id}
                                            className={cn(
                                                "flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer",
                                                selectedGear.includes(item.id)
                                                    ? "bg-primary/10 border-primary/50"
                                                    : "bg-ocean-dark/50 border-ocean-light/10 hover:border-ocean-light/30"
                                            )}
                                            onClick={() => handleGearToggle(item.id)}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <Checkbox
                                                    checked={selectedGear.includes(item.id)}
                                                    className="border-slate-500 data-[state=checked]:bg-primary data-[state=checked]:text-ocean-deep"
                                                />
                                                <span className="text-slate-200 font-medium">{item.name}</span>
                                            </div>
                                            <span className="text-primary font-bold">${item.price}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-6">
                                    <h3 className="text-lg font-bold text-white mb-4">Add-ons</h3>
                                    <div className="space-y-4">
                                        {availableExtras.map((item) => (
                                            <div key={item.id}
                                                className={cn(
                                                    "flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer",
                                                    selectedExtras.includes(item.id)
                                                        ? "bg-primary/10 border-primary/50"
                                                        : "bg-ocean-dark/50 border-ocean-light/10 hover:border-ocean-light/30"
                                                )}
                                                onClick={() => handleExtrasToggle(item.id)}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <Checkbox
                                                        checked={selectedExtras.includes(item.id)}
                                                        className="border-slate-500 data-[state=checked]:bg-primary data-[state=checked]:text-ocean-deep"
                                                    />
                                                    <span className="text-slate-200 font-medium">{item.name}</span>
                                                </div>
                                                <span className="text-primary font-bold">${item.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-12 pt-8 border-t border-ocean-light/10">
                            <Button
                                variant="ghost"
                                onClick={prevStep}
                                disabled={currentStep === 0}
                                className="text-slate-400 hover:text-white"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back
                            </Button>
                            <Button
                                onClick={nextStep}
                                className="bg-primary text-ocean-deep font-bold px-8 hover:bg-primary/90"
                            >
                                {currentStep === steps.length - 1 ? "Confirm Booking" : "Next Step"} <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Sidebar Summary */}
                    <div className="lg:col-span-1">
                        <PricingSummary
                            basePrice={150}
                            gearItems={getGearItems()}
                            extras={getExtraItems()}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}
