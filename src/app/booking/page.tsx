"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Check, ArrowRight, ArrowLeft, MapPin, Star, ShieldAlert, Award, CreditCard, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PricingSummary from "@/components/features/PricingSummary";

const steps = ["Dates & Info", "Equipment", "Diver Details", "Review & Pay"];

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

const coursesList = [
    { id: "discover-scuba", name: "Discover Scuba", price: 110, minAge: 10, prereqs: "None", duration: "Half day" },
    { id: "open-water", name: "Open Water Diver", price: 450, minAge: 10, prereqs: "None", duration: "3–5 days" },
    { id: "advanced-ow", name: "Advanced Open Water", price: 380, minAge: 12, prereqs: "Open Water Diver", duration: "2–3 days" },
    { id: "rescue-diver", name: "Rescue Diver", price: 420, minAge: 12, prereqs: "Advanced Open Water + EFR", duration: "2–3 days" },
    { id: "nitrox", name: "Enriched Air (Nitrox)", price: 150, minAge: 10, prereqs: "Open Water Diver", duration: "1 day" },
    { id: "buoyancy", name: "Peak Performance Buoyancy", price: 180, minAge: 10, prereqs: "Open Water Diver", duration: "1–2 days" },
    { id: "divemaster", name: "Divemaster", price: 850, minAge: 18, prereqs: "Rescue Diver + 40 logged dives", duration: "Weeks–months" },
    { id: "instructor", name: "Open Water Scuba Instructor", price: 1400, minAge: 18, prereqs: "Divemaster + 100 logged dives", duration: "2+ weeks" },
];

const diveSitesList = [
    { id: "blue-corner", name: "Blue Corner, Palau", price: 150 },
    { id: "yongala", name: "SS Yongala, Australia", price: 175 },
    { id: "great-blue-hole", name: "Great Blue Hole, Belize", price: 200 },
    { id: "manta-point", name: "Manta Point, Indonesia", price: 140 },
];

function BookingContent() {
    const searchParams = useSearchParams();
    
    // Core Booking States
    const [bookingType, setBookingType] = useState<"dive" | "course">("dive");
    const [currentStep, setCurrentStep] = useState(0);
    const [date, setDate] = useState<Date | undefined>(new Date(Date.now() + 86400000)); // default to tomorrow
    const [selectedGear, setSelectedGear] = useState<string[]>([]);
    const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
    
    // Dive Specific
    const [selectedSiteId, setSelectedSiteId] = useState("blue-corner");
    const [experienceLevel, setExperienceLevel] = useState("Open Water");
    
    // Course Specific
    const [selectedCourseId, setSelectedCourseId] = useState("open-water");
    const [trainingLocation, setTrainingLocation] = useState("Palau Training Center");

    // Diver Personal Details Form States
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [dob, setDob] = useState("");
    
    // Dive Specific Details
    const [emergencyName, setEmergencyName] = useState("");
    const [emergencyPhone, setEmergencyPhone] = useState("");
    const [safeDivingAgreed, setSafeDivingAgreed] = useState(false);
    
    // Course Specific Details
    const [padiMedicalAgreed, setPadiMedicalAgreed] = useState(false);
    
    // Shared Declarations
    const [conductAgreed, setConductAgreed] = useState(false);

    // Mock Payment Form States
    const [cardNumber, setCardNumber] = useState("");
    const [cardExpiry, setCardExpiry] = useState("");
    const [cardCvc, setCardCvc] = useState("");

    // Execution States
    const [isProcessing, setIsProcessing] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [confirmationCode, setConfirmationCode] = useState("");

    // Initialize state from search parameters
    useEffect(() => {
        const type = searchParams.get("type");
        const course = searchParams.get("course");
        const site = searchParams.get("site");

        if (type === "course") {
            setBookingType("course");
            if (course) {
                const found = coursesList.find((c) => c.id === course);
                if (found) setSelectedCourseId(found.id);
            }
        } else if (type === "dive") {
            setBookingType("dive");
            if (site) {
                const found = diveSitesList.find((s) => s.id === site);
                if (found) setSelectedSiteId(found.id);
            }
        }
    }, [searchParams]);

    const handleGearToggle = (id: string) => {
        setSelectedGear((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
    };
    const handleExtrasToggle = (id: string) => {
        setSelectedExtras((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
    };

    const getSelectedCourse = () => coursesList.find((c) => c.id === selectedCourseId) || coursesList[1];
    const getSelectedSite = () => diveSitesList.find((s) => s.id === selectedSiteId) || diveSitesList[0];

    const getBasePrice = () => {
        if (bookingType === "course") {
            return getSelectedCourse().price;
        } else {
            return getSelectedSite().price;
        }
    };

    const getGearItems = () => availableGear.filter((g) => selectedGear.includes(g.id)).map((g) => ({ name: g.name, cost: g.price }));
    const getExtraItems = () => bookingType === "dive" 
        ? availableExtras.filter((e) => selectedExtras.includes(e.id)).map((e) => ({ name: e.name, cost: e.price }))
        : [];

    const getPricingTitle = () => {
        if (bookingType === "course") {
            return `${getSelectedCourse().name} Course`;
        } else {
            return `Boat Dive: ${getSelectedSite().name.split(",")[0]}`;
        }
    };

    const getPricingDescription = () => {
        if (bookingType === "course") {
            return `PADI Certification, classroom & in-water instruction`;
        } else {
            return `2-Tank boat dive includes weights & guide`;
        }
    };

    // Calculate age based on Date of Birth
    const calculateAge = () => {
        if (!dob) return 0;
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const getAgeValidation = () => {
        if (bookingType !== "course" || !dob) return { ok: true, msg: "" };
        const age = calculateAge();
        const course = getSelectedCourse();
        if (age < course.minAge) {
            return {
                ok: false,
                msg: `The minimum age required for the ${course.name} is ${course.minAge} years. The age entered is ${age} years.`,
            };
        }
        return { ok: true, msg: "" };
    };

    const isStepValid = () => {
        if (currentStep === 0) {
            return date !== undefined;
        }
        if (currentStep === 1) {
            return true; // equipment is optional
        }
        if (currentStep === 2) {
            // Diver Personal details validation
            if (!fullName.trim() || !email.trim() || !phone.trim()) return false;
            
            // Shared checks
            if (!conductAgreed) return false;
            
            // Course checks
            if (bookingType === "course") {
                if (!dob) return false;
                const { ok } = getAgeValidation();
                if (!ok) return false;
                if (!padiMedicalAgreed) return false;
            } else {
                // Dive checks
                if (!emergencyName.trim() || !emergencyPhone.trim()) return false;
                if (!safeDivingAgreed) return false;
            }
            return true;
        }
        if (currentStep === 3) {
            return cardNumber.replace(/\s/g, "").length === 16 && cardExpiry.length === 5 && cardCvc.length === 3;
        }
        return true;
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isStepValid()) return;
        
        if (currentStep === steps.length - 1) {
            // Processing payment simulation
            setIsProcessing(true);
            
            setTimeout(() => {
                setIsProcessing(false);
                setConfirmationCode(`BH-${Math.floor(100000 + Math.random() * 900000)}`);
                setIsConfirmed(true);
            }, 1800);
        } else {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

    if (isConfirmed) {
        return (
            <div className="max-w-3xl mx-auto bg-slate-900/60 border border-cyan-500/30 rounded-3xl p-8 md:p-12 text-center shadow-2xl backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10" />
                
                <div className="w-20 h-20 bg-gradient-to-tr from-cyan-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(34,211,238,0.3)] animate-pulse">
                    <Check className="w-10 h-10 text-slate-900 stroke-[3]" />
                </div>
                
                <h2 className="text-4xl font-extrabold text-white mb-2 leading-tight">Adventure Confirmed!</h2>
                <p className="text-cyan-400 text-sm font-semibold tracking-wider mb-6" style={{ fontFamily: "system-ui, sans-serif" }}>
                    Reservation ID: {confirmationCode}
                </p>
                
                <div className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800/80 mb-8 max-w-xl mx-auto text-left">
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-cyan-400" /> Booking Details
                    </h3>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm" style={{ fontFamily: "system-ui, sans-serif" }}>
                        <span className="text-slate-500 font-medium">Activity:</span>
                        <span className="text-slate-200 font-semibold text-right">
                            {bookingType === "course" ? getSelectedCourse().name : getSelectedSite().name}
                        </span>
                        
                        <span className="text-slate-500 font-medium">Date:</span>
                        <span className="text-slate-200 font-semibold text-right">
                            {date ? format(date, "PPP") : ""}
                        </span>
                        
                        <span className="text-slate-500 font-medium">Diver:</span>
                        <span className="text-slate-200 font-semibold text-right">{fullName}</span>

                        <span className="text-slate-500 font-medium">Location:</span>
                        <span className="text-slate-200 font-semibold text-right">
                            {bookingType === "course" ? trainingLocation : getSelectedSite().location}
                        </span>
                    </div>
                </div>

                <div className="max-w-xl mx-auto text-left mb-10">
                    <h3 className="text-white font-bold text-base mb-3" style={{ fontFamily: "system-ui, sans-serif" }}>Important Next Steps</h3>
                    <ul className="space-y-4 text-sm text-slate-300" style={{ fontFamily: "system-ui, sans-serif" }}>
                        <li className="flex items-start gap-3">
                            <span className="w-5 h-5 bg-cyan-400/10 text-cyan-400 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                            <div>
                                <p className="font-semibold text-white">Confirmation Email</p>
                                <p className="text-slate-400 text-xs">We've sent a reservation receipt and packing list to <span className="text-slate-300">{email}</span>.</p>
                            </div>
                        </li>
                        {bookingType === "course" ? (
                            <>
                                <li className="flex items-start gap-3">
                                    <span className="w-5 h-5 bg-cyan-400/10 text-cyan-400 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                                    <div>
                                        <p className="font-semibold text-white">PADI eLearning</p>
                                        <p className="text-slate-400 text-xs">You will receive your PADI digital activation code within 24 hours. Complete the online homework modules before your in-water training date.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-5 h-5 bg-cyan-400/10 text-cyan-400 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
                                    <div>
                                        <p className="font-semibold text-white">Medical Statement</p>
                                        <p className="text-slate-400 text-xs">Please review and print the PADI Medical Release form. If you mark "Yes" on any conditions, you will need a signed doctor's release before pool sessions.</p>
                                    </div>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="flex items-start gap-3">
                                    <span className="w-5 h-5 bg-cyan-400/10 text-cyan-400 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                                    <div>
                                        <p className="font-semibold text-white">Check-in Sizing</p>
                                        <p className="text-slate-400 text-xs">Since you rented gear, please arrive at the center by 7:15 AM on the day of departure for professional wetsuit and BCD fitting.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-5 h-5 bg-cyan-400/10 text-cyan-400 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
                                    <div>
                                        <p className="font-semibold text-white">Bring Credentials</p>
                                        <p className="text-slate-400 text-xs">Don't forget to pack your physical certification card or digital PADI eCard, along with your logbook to show your divemaster.</p>
                                    </div>
                                </li>
                            </>
                        )}
                    </ul>
                </div>

                <div className="flex justify-center gap-4">
                    <a
                        href="/courses"
                        className="bg-cyan-400 text-slate-900 font-bold px-8 py-3 rounded-full hover:bg-cyan-300 transition-colors duration-200 text-sm"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        Browse Other Courses
                    </a>
                    <a
                        href="/"
                        className="border border-slate-700 hover:border-slate-500 text-slate-300 font-semibold px-8 py-3 rounded-full transition-colors text-sm"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        Return Home
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 bg-slate-900/40 p-6 md:p-8 rounded-2xl border border-slate-700/60 shadow-xl backdrop-blur-sm">
                
                {/* Booking Type Segmented Switch */}
                {currentStep === 0 && (
                    <div className="flex bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/80 mb-8 max-w-sm mx-auto">
                        <button
                            type="button"
                            onClick={() => setBookingType("dive")}
                            className={cn(
                                "flex-1 text-center py-2.5 rounded-lg font-bold text-xs tracking-wider uppercase transition-all duration-200",
                                bookingType === "dive"
                                    ? "bg-cyan-400 text-slate-900 shadow-lg shadow-cyan-400/10"
                                    : "text-slate-400 hover:text-slate-200"
                            )}
                            style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                            Dive Expedition
                        </button>
                        <button
                            type="button"
                            onClick={() => setBookingType("course")}
                            className={cn(
                                "flex-1 text-center py-2.5 rounded-lg font-bold text-xs tracking-wider uppercase transition-all duration-200",
                                bookingType === "course"
                                    ? "bg-cyan-400 text-slate-900 shadow-lg shadow-cyan-400/10"
                                    : "text-slate-400 hover:text-slate-200"
                            )}
                            style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                            Scuba Course
                        </button>
                    </div>
                )}

                <form onSubmit={handleFormSubmit}>
                    {/* STEP 0: DATES & INFO */}
                    {currentStep === 0 && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="border-b border-slate-700/60 pb-4 mb-6">
                                <h2 className="text-2xl font-bold text-white">
                                    {bookingType === "course" ? "Course Selection & Dates" : "Dates & Location"}
                                </h2>
                                <p className="text-slate-400 mt-1 text-sm" style={{ fontFamily: "system-ui, sans-serif" }}>
                                    {bookingType === "course" 
                                        ? "Choose the PADI training certification and start date." 
                                        : "Choose your destination, preferred dates, and experience level."}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {bookingType === "course" ? (
                                    <div className="bg-slate-900/60 p-6 rounded-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="bg-cyan-400/10 p-2 rounded-lg text-cyan-400">
                                                <Award className="w-5 h-5" />
                                            </div>
                                            <label className="text-base font-semibold text-slate-200">Select PADI Course</label>
                                        </div>
                                        <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                                            <SelectTrigger className="w-full bg-slate-800 border-slate-600 text-white h-12">
                                                <SelectValue placeholder="Select a course" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-slate-700 text-white">
                                                {coursesList.map((c) => (
                                                    <SelectItem key={c.id} value={c.id}>
                                                        {c.name} (${c.price})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <div className="mt-3 text-xs text-slate-500 flex flex-col gap-1" style={{ fontFamily: "system-ui, sans-serif" }}>
                                            <span>⏱ Duration: {getSelectedCourse().duration}</span>
                                            <span>📋 Prerequisites: {getSelectedCourse().prereqs}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-slate-900/60 p-6 rounded-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="bg-cyan-400/10 p-2 rounded-lg text-cyan-400">
                                                <MapPin className="w-5 h-5" />
                                            </div>
                                            <label className="text-base font-semibold text-slate-200">Destination</label>
                                        </div>
                                        <Select value={selectedSiteId} onValueChange={setSelectedSiteId}>
                                            <SelectTrigger className="w-full bg-slate-800 border-slate-600 text-white h-12">
                                                <SelectValue placeholder="Select a site" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-slate-700 text-white">
                                                {diveSitesList.map((site) => (
                                                    <SelectItem key={site.id} value={site.id}>
                                                        {site.name} (${site.price})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                <div className="bg-slate-900/60 p-6 rounded-xl border border-blue-400/20 hover:border-blue-400/40 transition-colors">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="bg-blue-400/10 p-2 rounded-lg text-blue-400">
                                            <CalendarIcon className="w-5 h-5" />
                                        </div>
                                        <label className="text-base font-semibold text-slate-200">
                                            {bookingType === "course" ? "Start Date" : "Date"}
                                        </label>
                                    </div>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <button
                                                type="button"
                                                className={cn(
                                                    "w-full flex items-center justify-start text-left px-3 h-12 rounded-lg bg-slate-800 border border-slate-600 text-sm transition-colors hover:border-slate-400 text-white",
                                                    !date && "text-slate-500"
                                                )}
                                                style={{ fontFamily: "system-ui, sans-serif" }}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4 text-blue-400/75" />
                                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                                            </button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 bg-slate-900 border-slate-700 shadow-2xl">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={setDate}
                                                disabled={(day) => day < new Date()}
                                                initialFocus
                                                className="text-white rounded-md"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            {bookingType === "course" ? (
                                <div className="bg-slate-900/60 p-6 rounded-xl border border-teal-400/20 hover:border-teal-400/40 transition-colors">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="bg-teal-400/10 p-2 rounded-lg text-teal-400">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <label className="block text-base font-semibold text-slate-200">Training Location</label>
                                            <span className="text-xs text-slate-500" style={{ fontFamily: "system-ui, sans-serif" }}>
                                                Select your local classroom & confined pool center location.
                                            </span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" style={{ fontFamily: "system-ui, sans-serif" }}>
                                        {["Palau Training Center", "Australia GBR Center", "Belize Hole Center", "Indonesia Nusa Center"].map((loc) => (
                                            <button
                                                key={loc}
                                                type="button"
                                                onClick={() => setTrainingLocation(loc)}
                                                className={cn(
                                                    "flex items-center gap-3 border p-4 rounded-xl transition-all text-left",
                                                    trainingLocation === loc
                                                        ? "border-teal-400/60 bg-teal-400/10"
                                                        : "border-slate-700/60 bg-slate-800/40 hover:border-slate-600"
                                                )}
                                            >
                                                <div className={cn(
                                                    "h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0",
                                                    trainingLocation === loc ? "border-teal-400" : "border-slate-600"
                                                )}>
                                                    {trainingLocation === loc && <div className="w-2 h-2 bg-teal-400 rounded-full" />}
                                                </div>
                                                <span className="text-sm font-medium text-slate-200">{loc}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-slate-900/60 p-6 rounded-xl border border-teal-400/20 hover:border-teal-400/40 transition-colors">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="bg-teal-400/10 p-2 rounded-lg text-teal-400">
                                            <Star className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <label className="block text-base font-semibold text-slate-200">Experience Level</label>
                                            <span className="text-xs text-slate-500" style={{ fontFamily: "system-ui, sans-serif" }}>
                                                Helps us match you with the right boat group and guide.
                                            </span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" style={{ fontFamily: "system-ui, sans-serif" }}>
                                        {["Open Water", "Advanced", "Rescue/Master"].map((level) => (
                                            <button
                                                key={level}
                                                type="button"
                                                onClick={() => setExperienceLevel(level)}
                                                className={cn(
                                                    "flex items-center gap-3 border p-4 rounded-xl transition-all text-left",
                                                    experienceLevel === level
                                                        ? "border-teal-400/60 bg-teal-400/10"
                                                        : "border-slate-700/60 bg-slate-800/40 hover:border-slate-600"
                                                )}
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
                            )}
                        </div>
                    )}

                    {/* STEP 1: EQUIPMENT RENTAL */}
                    {currentStep === 1 && (
                        <div className="space-y-8 animate-fade-in-up">
                            <div className="border-b border-slate-700/60 pb-4 mb-2">
                                <h2 className="text-2xl font-bold text-white">Equipment Rental & Extras</h2>
                                <p className="text-slate-400 text-sm mt-1" style={{ fontFamily: "system-ui, sans-serif" }}>
                                    Select the gear you need to hire. Tanks, weights, and basic safety markers are always included.
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

                            {bookingType === "dive" && (
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-3">Expedition Add-ons</h3>
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
                            )}
                        </div>
                    )}

                    {/* STEP 2: DIVER DETAILS & PADI DISCLOSURES */}
                    {currentStep === 2 && (
                        <div className="space-y-6 animate-fade-in-up">
                            <div className="border-b border-slate-700/60 pb-4 mb-2">
                                <h2 className="text-2xl font-bold text-white">Diver Information</h2>
                                <p className="text-slate-400 text-sm mt-1" style={{ fontFamily: "system-ui, sans-serif" }}>
                                    Please supply information for the primary diver checking out.
                                </p>
                            </div>

                            <div className="space-y-4" style={{ fontFamily: "system-ui, sans-serif" }}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            required
                                            placeholder="Jacques Cousteau"
                                            className="w-full h-11 px-4 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            placeholder="jacques@horizon.org"
                                            className="w-full h-11 px-4 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            required
                                            placeholder="+1 (555) 123-4567"
                                            className="w-full h-11 px-4 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                                        />
                                    </div>
                                    {bookingType === "course" && (
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Date of Birth (For Cert)</label>
                                            <input
                                                type="date"
                                                value={dob}
                                                onChange={(e) => setDob(e.target.value)}
                                                required
                                                className="w-full h-11 px-4 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Age Validation alert */}
                                {bookingType === "course" && dob && !getAgeValidation().ok && (
                                    <div className="bg-red-950/40 border border-red-500/30 rounded-xl p-4 flex gap-3 text-red-200 items-start text-xs leading-relaxed">
                                        <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-bold block text-white mb-0.5">Prerequisite Alert</span>
                                            {getAgeValidation().msg}
                                        </div>
                                    </div>
                                )}

                                {/* Dive specific Emergency Contact */}
                                {bookingType === "dive" && (
                                    <div className="bg-slate-900/30 p-5 rounded-xl border border-slate-800/80 space-y-4">
                                        <h3 className="text-white font-semibold text-sm">Emergency Contact</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Contact Name</label>
                                                <input
                                                    type="text"
                                                    value={emergencyName}
                                                    onChange={(e) => setEmergencyName(e.target.value)}
                                                    required={bookingType === "dive"}
                                                    placeholder="Sylvia Earle"
                                                    className="w-full h-11 px-4 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Contact Phone</label>
                                                <input
                                                    type="tel"
                                                    value={emergencyPhone}
                                                    onChange={(e) => setEmergencyPhone(e.target.value)}
                                                    required={bookingType === "dive"}
                                                    placeholder="+1 (555) 987-6543"
                                                    className="w-full h-11 px-4 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Agreements Checklist */}
                                <div className="space-y-3 pt-4 border-t border-slate-800/80">
                                    <h3 className="text-white font-semibold text-sm">Required Declarations</h3>
                                    
                                    {bookingType === "course" ? (
                                        <div className="flex gap-3 items-start cursor-pointer" onClick={() => setPadiMedicalAgreed(!padiMedicalAgreed)}>
                                            <Checkbox
                                                checked={padiMedicalAgreed}
                                                className="border-slate-500 data-[state=checked]:bg-cyan-400 data-[state=checked]:text-slate-900 mt-1"
                                            />
                                            <p className="text-xs text-slate-400 leading-normal">
                                                I certify that I am fit to dive and have reviewed the PADI medical release policy. I agree to submit a signed doctor's release if I have any qualifying conditions prior to starting pool work.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="flex gap-3 items-start cursor-pointer" onClick={() => setSafeDivingAgreed(!safeDivingAgreed)}>
                                            <Checkbox
                                                checked={safeDivingAgreed}
                                                className="border-slate-500 data-[state=checked]:bg-cyan-400 data-[state=checked]:text-slate-900 mt-1"
                                            />
                                            <p className="text-xs text-slate-400 leading-normal">
                                                I confirm I hold an active scuba certification (Open Water or higher). I agree to follow safe diving practices, dive with a buddy, and monitor my air supply.
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex gap-3 items-start cursor-pointer" onClick={() => setConductAgreed(!conductAgreed)}>
                                        <Checkbox
                                            checked={conductAgreed}
                                            className="border-slate-500 data-[state=checked]:bg-cyan-400 data-[state=checked]:text-slate-900 mt-1"
                                        />
                                        <p className="text-xs text-slate-400 leading-normal">
                                            I agree to respect the local marine sanctuaries. I will not touch, tease, or damage coral, marine life, or dive sites. I uphold a strict zero-impact diving policy.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: REVIEW & SECURE PAYMENT */}
                    {currentStep === 3 && (
                        <div className="space-y-8 animate-fade-in-up">
                            <div className="border-b border-slate-700/60 pb-4">
                                <h2 className="text-2xl font-bold text-white">Payment & Confirmation</h2>
                                <p className="text-slate-400 text-sm mt-1" style={{ fontFamily: "system-ui, sans-serif" }}>
                                    Review your details and input mock credit card details to complete your reservation.
                                </p>
                            </div>

                            {/* Booking Info Card */}
                            <div className="bg-slate-950/60 rounded-xl p-5 border border-slate-800/80 space-y-4 text-sm" style={{ fontFamily: "system-ui, sans-serif" }}>
                                <div className="flex justify-between items-center pb-3 border-b border-slate-800/80">
                                    <span className="text-slate-400 font-semibold uppercase tracking-wider text-xs">Summary</span>
                                    <span className="text-cyan-400 text-xs font-bold uppercase bg-cyan-400/10 px-2 py-0.5 rounded-full">
                                        {bookingType === "course" ? "Course Cert" : "Expedition"}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-y-2">
                                    <span className="text-slate-500">Selection:</span>
                                    <span className="text-white font-semibold text-right">
                                        {bookingType === "course" ? getSelectedCourse().name : getSelectedSite().name}
                                    </span>

                                    <span className="text-slate-500">Scheduled Date:</span>
                                    <span className="text-white font-semibold text-right">
                                        {date ? format(date, "PPP") : ""}
                                    </span>

                                    <span className="text-slate-500">Primary Diver:</span>
                                    <span className="text-white font-semibold text-right">{fullName}</span>

                                    <span className="text-slate-500">Contact Email:</span>
                                    <span className="text-slate-300 text-right truncate max-w-[180px] self-end">{email}</span>
                                </div>
                            </div>

                            {/* Payment details */}
                            <div className="space-y-4" style={{ fontFamily: "system-ui, sans-serif" }}>
                                <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-cyan-400" /> Secure Payment Detail
                                </h3>

                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Card Number</label>
                                        <input
                                            type="text"
                                            value={cardNumber}
                                            onChange={(e) => {
                                                const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                                                const formatted = v.replace(/(\d{4})(?=\d)/g, "$1 ");
                                                setCardNumber(formatted);
                                            }}
                                            placeholder="4111 2222 3333 4444"
                                            required
                                            className="w-full h-11 px-4 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Expiry Date</label>
                                            <input
                                                type="text"
                                                value={cardExpiry}
                                                onChange={(e) => {
                                                    const v = e.target.value.replace(/\D/g, "").slice(0, 4);
                                                    if (v.length >= 2) {
                                                        setCardExpiry(`${v.slice(0, 2)}/${v.slice(2)}`);
                                                    } else {
                                                        setCardExpiry(v);
                                                    }
                                                }}
                                                placeholder="MM/YY"
                                                required
                                                className="w-full h-11 px-4 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">CVC</label>
                                            <input
                                                type="password"
                                                value={cardCvc}
                                                onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 3))}
                                                placeholder="123"
                                                required
                                                className="w-full h-11 px-4 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-12 pt-8 border-t border-slate-700/40">
                        <button
                            type="button"
                            onClick={prevStep}
                            disabled={currentStep === 0 || isProcessing}
                            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors disabled:opacity-30 text-sm font-medium"
                            style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                            <ArrowLeft className="h-4 w-4" /> Back
                        </button>
                        <button
                            type="submit"
                            disabled={!isStepValid() || isProcessing}
                            className="flex items-center justify-center gap-2 bg-cyan-400 text-slate-900 font-bold text-sm px-8 py-3 rounded-full hover:bg-cyan-300 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed transition-all duration-200 min-w-[150px] shadow-lg shadow-cyan-400/5"
                            style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                            {isProcessing ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                                    <span>Processing...</span>
                                </div>
                            ) : currentStep === steps.length - 1 ? (
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 fill-slate-900" />
                                    <span>Confirm & Pay</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1">
                                    <span>Next Step</span>
                                    <ArrowRight className="h-4 w-4" />
                                </div>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Pricing Summary Sidepanel */}
            <div className="lg:col-span-1">
                <div className="sticky top-28">
                    <PricingSummary
                        basePrice={getBasePrice()}
                        gearItems={getGearItems()}
                        extras={getExtraItems()}
                        title={getPricingTitle()}
                        description={getPricingDescription()}
                    />
                </div>
            </div>
        </div>
    );
}

export default function Booking() {
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

            <div className="relative container mx-auto px-6 max-w-6xl pt-32 animate-fade-in-up">
                <p className="text-cyan-400 text-xs uppercase tracking-[0.3em] font-semibold mb-4" style={{ fontFamily: "system-ui, sans-serif" }}>
                    Blue Horizon Dive Shop
                </p>
                <h1 className="text-5xl font-bold text-white mb-2" style={{ letterSpacing: "-0.02em" }}>Complete Your Booking</h1>
                <p className="text-slate-400 mb-12 text-lg" style={{ fontFamily: "system-ui, sans-serif" }}>
                    Secure your spot for an instruction course or dive expedition.
                </p>

                {/* Unified Suspense Wrapper for Search Parameters */}
                <Suspense fallback={<div className="text-slate-400 py-20 text-center font-medium">Loading checkout system...</div>}>
                    <BookingContent />
                </Suspense>
            </div>
        </div>
    );
}