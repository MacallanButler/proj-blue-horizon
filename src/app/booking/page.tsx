"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Check, ArrowRight, ArrowLeft, MapPin, Star, ShieldAlert, Award, CreditCard, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PricingSummary from "@/components/features/PricingSummary";
import { apiClient } from "@/lib/apiClient";

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

const diveSitesList = [
    { id: "blue-corner", name: "Blue Corner, Palau", price: 150, difficulty: "Advanced" },
    { id: "yongala", name: "SS Yongala, Australia", price: 175, difficulty: "Advanced" },
    { id: "great-blue-hole", name: "Great Blue Hole, Belize", price: 200, difficulty: "Advanced" },
    { id: "manta-point", name: "Manta Point, Indonesia", price: 140, difficulty: "Beginner" },
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
    const [availableTrips, setAvailableTrips] = useState<any[]>([]);
    const [selectedTripId, setSelectedTripId] = useState<number | null>(null);
    const [loadingTrips, setLoadingTrips] = useState(false);
    
    // Course Specific
    const [courses, setCourses] = useState<any[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
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
    const [error, setError] = useState("");
    const [user, setUser] = useState<any>(null);

    // Fetch user and courses list
    useEffect(() => {
        apiClient.getCurrentUser()
            .then((u) => {
                setUser(u);
                if (u) {
                    setFullName(u.name || "");
                    setEmail(u.email || "");
                    setPhone(u.phone || "");
                }
            })
            .catch(console.error);

        apiClient.getCourses()
            .then((data) => {
                setCourses(data || []);
                if (data && data.length > 0) {
                    // Set default course from search param or first one
                    const courseParam = searchParams.get("course");
                    const found = data.find((c: any) => c.title.toLowerCase().includes((courseParam || "").toLowerCase()));
                    setSelectedCourseId(found ? found.id : data[0].id);
                }
            })
            .catch(console.error);
    }, []);

    // Initialize state from search parameters for site
    useEffect(() => {
        const type = searchParams.get("type");
        const site = searchParams.get("site");

        if (type === "course") {
            setBookingType("course");
        } else if (type === "dive" || site) {
            setBookingType("dive");
            if (site) {
                const found = diveSitesList.find((s) => s.id === site);
                if (found) setSelectedSiteId(found.id);
            }
        }
    }, [searchParams]);

    // Load available trips dynamically based on site and date
    useEffect(() => {
        if (bookingType !== "dive" || !date) return;
        setLoadingTrips(true);
        const dateStr = date.toISOString().split("T")[0];

        apiClient.getTrips({
            dive_site_id: selectedSiteId,
            date_from: dateStr,
            date_to: dateStr
        })
        .then((trips) => {
            setAvailableTrips(trips);
            if (trips.length > 0) {
                setSelectedTripId(trips[0].id);
            } else {
                setSelectedTripId(null);
            }
        })
        .catch(console.error)
        .finally(() => setLoadingTrips(false));
    }, [selectedSiteId, date, bookingType]);

    const handleGearToggle = (id: string) => {
        setSelectedGear((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
    };
    const handleExtrasToggle = (id: string) => {
        setSelectedExtras((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
    };

    const getSelectedCourse = () => courses.find((c) => c.id === selectedCourseId) || { title: "Loading...", priceCents: 0, durationDays: 1 };
    const getSelectedSite = () => diveSitesList.find((s) => s.id === selectedSiteId) || diveSitesList[0];

    const getBasePrice = () => {
        if (bookingType === "course") {
            return getSelectedCourse().priceCents / 100;
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
            return `${getSelectedCourse().title} Course`;
        } else {
            return `Boat Dive: ${getSelectedSite().name.split(",")[0]}`;
        }
    };

    const getPricingDescription = () => {
        if (bookingType === "course") {
            return `${getSelectedCourse().durationDays}-day PADI instruction & certification`;
        } else {
            return `2-Tank boat dive includes weights & guide`;
        }
    };

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
        // hardcode minAge limit mapping based on common PADI standards
        const minAge = course.title.includes("Divemaster") || course.title.includes("Instructor") ? 18 : 10;
        if (age < minAge) {
            return {
                ok: false,
                msg: `The minimum age required for ${course.title} is ${minAge} years. The age entered is ${age} years.`,
            };
        }
        return { ok: true, msg: "" };
    };

    const isStepValid = () => {
        if (currentStep === 0) {
            if (bookingType === "dive") {
                return date !== undefined && selectedTripId !== null;
            }
            return date !== undefined && selectedCourseId !== null;
        }
        if (currentStep === 1) {
            return true;
        }
        if (currentStep === 2) {
            if (!fullName.trim() || !email.trim() || !phone.trim()) return false;
            if (!conductAgreed) return false;
            
            if (bookingType === "course") {
                if (!dob) return false;
                const { ok } = getAgeValidation();
                if (!ok) return false;
                if (!padiMedicalAgreed) return false;
            } else {
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

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isStepValid()) return;
        
        if (currentStep === steps.length - 1) {
            setIsProcessing(true);
            setError("");
            
            try {
                if (bookingType === "dive") {
                    if (!selectedTripId) throw new Error("No trip time slot selected.");
                    
                    const gearItems = getGearItems();
                    const extraItems = getExtraItems();
                    const basePrice = getBasePrice();
                    const gearCost = gearItems.reduce((acc, item) => acc + item.cost, 0);
                    const extraCost = extraItems.reduce((acc, item) => acc + item.cost, 0);
                    const totalCents = (basePrice + gearCost + extraCost) * 100;

                    const bookingParams = {
                        trip_id: selectedTripId,
                        guest_name: fullName,
                        guest_email: email,
                        guest_phone: phone,
                        gear_selections: selectedGear,
                        extras: selectedExtras,
                        total_cents: totalCents
                    };

                    const booking = await apiClient.createBooking(bookingParams);
                    const payment = await apiClient.createPaymentIntent(booking.id);
                    
                    setConfirmationCode(`BH-${booking.id}-${Math.floor(1000 + Math.random() * 9000)}`);
                    setIsConfirmed(true);
                } else {
                    if (!selectedCourseId) throw new Error("No course selected.");
                    
                    const enrollment = await apiClient.enrollInCourse(selectedCourseId);
                    setConfirmationCode(`CE-${enrollment.id}-${Math.floor(1000 + Math.random() * 9000)}`);
                    setIsConfirmed(true);
                }
            } catch (err: any) {
                setError(err.message || "An error occurred. Check your inputs or cert verification.");
            } finally {
                setIsProcessing(false);
            }
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
                            {bookingType === "course" ? getSelectedCourse().title : getSelectedSite().name}
                        </span>
                        
                        <span className="text-slate-500 font-medium">Date:</span>
                        <span className="text-slate-200 font-semibold text-right">
                            {date ? format(date, "PPP") : ""}
                        </span>
                        
                        <span className="text-slate-500 font-medium">Diver:</span>
                        <span className="text-slate-200 font-semibold text-right">{fullName}</span>
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
                                        <p className="font-semibold text-white">Check Certification Requirements</p>
                                        <p className="text-slate-400 text-xs">Ensure your PADI certification card is uploaded in your logbook dashboard. Trips to advanced sites require verification by our staff before departure.</p>
                                    </div>
                                </li>
                            </>
                        )}
                    </ul>
                </div>

                <div className="flex gap-4 justify-center">
                    <Link href="/" className="px-6 py-2.5 rounded-full border border-slate-700 hover:border-slate-500 text-slate-300 font-semibold text-sm transition-colors">
                        Back to Home
                    </Link>
                    {user && (
                        <Link href="/logbook" className="px-6 py-2.5 rounded-full bg-primary text-slate-900 font-bold text-sm hover:bg-primary/90 transition-colors">
                            View Logbook
                        </Link>
                    )}
                </div>
            </div>
        );
    }

    const getSelectedSiteDifficulty = () => {
        const site = getSelectedSite();
        return site.difficulty || "Beginner";
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Left/Middle Column (Wizard steps) */}
            <div className="lg:col-span-2 bg-slate-900/40 p-6 md:p-8 rounded-3xl border border-slate-800/80 shadow-xl backdrop-blur-sm">
                {/* Steps indicator */}
                <div className="flex justify-between items-center mb-10 max-w-md mx-auto">
                    {steps.map((step, idx) => (
                        <div key={idx} className="flex items-center">
                            <div className="flex flex-col items-center">
                                <div
                                    className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors border",
                                        idx === currentStep
                                            ? "bg-cyan-400 text-slate-950 border-cyan-400"
                                            : idx < currentStep
                                                ? "bg-cyan-950 text-cyan-400 border-cyan-500/30"
                                                : "bg-slate-900 text-slate-500 border-slate-800"
                                    )}
                                >
                                    {idx < currentStep ? <Check className="w-4 h-4" /> : idx + 1}
                                </div>
                                <span
                                    className={cn(
                                        "text-[10px] font-semibold mt-2 hidden sm:block",
                                        idx === currentStep ? "text-cyan-400" : "text-slate-500"
                                    )}
                                    style={{ fontFamily: "system-ui, sans-serif" }}
                                >
                                    {step}
                                </span>
                            </div>
                            {idx < steps.length - 1 && (
                                <div
                                    className={cn(
                                        "h-[2px] w-8 sm:w-16 mx-2 -mt-4 sm:-mt-6 rounded",
                                        idx < currentStep ? "bg-cyan-500/30" : "bg-slate-800"
                                    )}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Submitting error display */}
                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-950/20 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Booking Type Switcher (only at step 0) */}
                {currentStep === 0 && (
                    <div className="grid grid-cols-2 gap-4 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800/80 mb-8 max-w-sm mx-auto">
                        <button
                            type="button"
                            onClick={() => setBookingType("dive")}
                            className={cn(
                                "py-3 text-xs font-bold rounded-xl transition-all duration-200",
                                bookingType === "dive"
                                    ? "bg-cyan-400 text-slate-950 shadow-md"
                                    : "text-slate-400 hover:text-white"
                            )}
                        >
                            Fun Boat Dive
                        </button>
                        <button
                            type="button"
                            onClick={() => setBookingType("course")}
                            className={cn(
                                "py-3 text-xs font-bold rounded-xl transition-all duration-200",
                                bookingType === "course"
                                    ? "bg-cyan-400 text-slate-950 shadow-md"
                                    : "text-slate-400 hover:text-white"
                            )}
                        >
                            Scuba Course
                        </button>
                    </div>
                )}

                <form onSubmit={handleFormSubmit}>
                    {/* STEP 0: DATES & INFO */}
                    {currentStep === 0 && (
                        <div className="space-y-6">
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
                                    <div className="bg-slate-900/60 p-6 rounded-xl border border-cyan-500/20">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="bg-cyan-400/10 p-2 rounded-lg text-cyan-400">
                                                <Award className="w-5 h-5" />
                                            </div>
                                            <label className="text-base font-semibold text-slate-200">Select PADI Course</label>
                                        </div>
                                        {courses.length === 0 ? (
                                            <div className="flex items-center justify-center py-3 text-xs text-slate-500">
                                                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading courses...
                                            </div>
                                        ) : (
                                            <Select value={String(selectedCourseId || "")} onValueChange={(val) => setSelectedCourseId(Number(val))}>
                                                <SelectTrigger className="w-full bg-slate-800 border-slate-600 text-white h-12">
                                                    <SelectValue placeholder="Select a course" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                                                    {courses.map((c) => (
                                                        <SelectItem key={c.id} value={String(c.id)}>
                                                            {c.title} (${c.priceCents / 100})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                        <div className="mt-3 text-xs text-slate-500 flex flex-col gap-1" style={{ fontFamily: "system-ui, sans-serif" }}>
                                            <span>⏱ Duration: {getSelectedCourse().durationDays} days</span>
                                            <p className="mt-1 text-slate-400 italic">"{getSelectedCourse().description}"</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-slate-900/60 p-6 rounded-xl border border-cyan-500/20">
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
                                        
                                        {getSelectedSiteDifficulty() === "Advanced" && (
                                            <div className="mt-4 flex gap-2 items-start p-3 rounded-lg bg-amber-950/20 border border-amber-500/20 text-amber-400 text-xs">
                                                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                                                <span>This site requires <strong>Advanced Open Water</strong> certification or higher. Guest accounts can't verify credentials.</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="bg-slate-900/60 p-6 rounded-xl border border-blue-400/20">
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
                                                className="text-white rounded-md bg-slate-900"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            {/* Dynamic trip slot picker for dive bookings */}
                            {bookingType === "dive" && date && (
                                <div className="mt-6 p-6 bg-slate-900/60 rounded-xl border border-cyan-500/20">
                                    <h3 className="text-slate-200 font-bold mb-4 text-sm flex items-center gap-2">
                                        Available Time Slots
                                    </h3>
                                    {loadingTrips ? (
                                        <div className="flex justify-center py-6">
                                            <Loader2 className="w-6 h-6 text-primary animate-spin" />
                                        </div>
                                    ) : availableTrips.length === 0 ? (
                                        <p className="text-amber-400 text-xs flex items-center gap-2 bg-amber-950/20 p-3 rounded-lg border border-amber-500/20">
                                            <ShieldAlert className="w-4 h-4" />
                                            No dive trips scheduled on this date. Try selecting another date.
                                        </p>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {availableTrips.map((trip) => (
                                                <button
                                                    type="button"
                                                    key={trip.id}
                                                    onClick={() => setSelectedTripId(trip.id)}
                                                    className={cn(
                                                        "p-3 rounded-lg border text-left transition-all flex flex-col gap-1",
                                                        selectedTripId === trip.id
                                                            ? "bg-cyan-500/10 border-cyan-400 text-white"
                                                            : "bg-slate-800/50 border-slate-700 hover:border-slate-500 text-slate-300"
                                                    )}
                                                >
                                                    <span className="text-sm font-bold">{trip.departureTime}</span>
                                                    <span className="text-[10px] text-slate-400">Required Cert: {trip.requiredCertLevel.replace("_", " ").toUpperCase()}</span>
                                                    <span className={cn(
                                                        "text-[10px] font-semibold mt-1",
                                                        trip.spotsRemaining <= 2 ? "text-red-400 animate-pulse" : "text-emerald-400"
                                                    )}>
                                                        {trip.spotsRemaining} spots left
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 1: EQUIPMENT & EXTRAS */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div className="border-b border-slate-700/60 pb-4 mb-6">
                                <h2 className="text-2xl font-bold text-white">Equipment Rental & Add-ons</h2>
                                <p className="text-slate-400 mt-1 text-sm" style={{ fontFamily: "system-ui, sans-serif" }}>
                                    Select optional gear rental or extras for your activity.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-white font-bold mb-3 text-sm">Gear Rental (Per Day)</h3>
                                    <div className="grid sm:grid-cols-2 gap-3">
                                        {availableGear.map((g) => (
                                            <button
                                                type="button"
                                                key={g.id}
                                                onClick={() => handleGearToggle(g.id)}
                                                className={cn(
                                                    "flex items-center justify-between p-4 rounded-xl border transition-all text-left",
                                                    selectedGear.includes(g.id)
                                                        ? "bg-cyan-400/10 border-cyan-400 text-white"
                                                        : "bg-slate-850/50 border-slate-700 text-slate-300 hover:border-slate-500"
                                                )}
                                            >
                                                <span className="text-sm font-medium">{g.name}</span>
                                                <span className="text-cyan-400 font-bold text-sm">${g.price}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {bookingType === "dive" && (
                                    <div>
                                        <h3 className="text-white font-bold mb-3 text-sm">Expedition Extras</h3>
                                        <div className="grid sm:grid-cols-2 gap-3">
                                            {availableExtras.map((e) => (
                                                <button
                                                    type="button"
                                                    key={e.id}
                                                    onClick={() => handleExtrasToggle(e.id)}
                                                    className={cn(
                                                        "flex items-center justify-between p-4 rounded-xl border transition-all text-left",
                                                        selectedExtras.includes(e.id)
                                                            ? "bg-cyan-400/10 border-cyan-400 text-white"
                                                            : "bg-slate-850/50 border-slate-700 text-slate-300 hover:border-slate-500"
                                                    )}
                                                >
                                                    <span className="text-sm font-medium">{e.name}</span>
                                                    <span className="text-cyan-400 font-bold text-sm">${e.price}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* STEP 2: DIVER DETAILS */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div className="border-b border-slate-700/60 pb-4 mb-6">
                                <h2 className="text-2xl font-bold text-white">Diver Information</h2>
                                <p className="text-slate-400 mt-1 text-sm" style={{ fontFamily: "system-ui, sans-serif" }}>
                                    Fill in details of the diver attending the activity.
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="text-xs text-slate-400 font-semibold block mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={e => setFullName(e.target.value)}
                                        className="w-full bg-slate-850/60 border border-slate-700 text-white text-sm px-3 h-11 rounded-xl focus:border-cyan-400 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 font-semibold block mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full bg-slate-850/60 border border-slate-700 text-white text-sm px-3 h-11 rounded-xl focus:border-cyan-400 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 font-semibold block mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        className="w-full bg-slate-850/60 border border-slate-700 text-white text-sm px-3 h-11 rounded-xl focus:border-cyan-400 focus:outline-none"
                                        required
                                    />
                                </div>
                                {bookingType === "course" && (
                                    <div className="col-span-2">
                                        <label className="text-xs text-slate-400 font-semibold block mb-1">Date of Birth</label>
                                        <input
                                            type="date"
                                            value={dob}
                                            onChange={e => setDob(e.target.value)}
                                            className="w-full bg-slate-850/60 border border-slate-700 text-white text-sm px-3 h-11 rounded-xl focus:border-cyan-400 focus:outline-none"
                                            required
                                        />
                                        {!getAgeValidation().ok && (
                                            <p className="text-red-400 text-xs mt-1.5">{getAgeValidation().msg}</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {bookingType === "dive" ? (
                                <div className="space-y-4 pt-4 border-t border-slate-800">
                                    <h3 className="text-white font-bold text-sm">Emergency Contact</h3>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-slate-400 font-semibold block mb-1">Contact Name</label>
                                            <input
                                                type="text"
                                                value={emergencyName}
                                                onChange={e => setEmergencyName(e.target.value)}
                                                className="w-full bg-slate-850/60 border border-slate-700 text-white text-sm px-3 h-11 rounded-xl focus:border-cyan-400 focus:outline-none"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-400 font-semibold block mb-1">Contact Phone</label>
                                            <input
                                                type="tel"
                                                value={emergencyPhone}
                                                onChange={e => setEmergencyPhone(e.target.value)}
                                                className="w-full bg-slate-850/60 border border-slate-700 text-white text-sm px-3 h-11 rounded-xl focus:border-cyan-400 focus:outline-none"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 space-y-3">
                                        <label className="flex gap-3 text-xs text-slate-300 font-medium cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={safeDivingAgreed}
                                                onChange={e => setSafeDivingAgreed(e.target.checked)}
                                                className="w-4 h-4 rounded border-slate-700 text-cyan-400 bg-slate-800 mt-0.5"
                                            />
                                            <span>I agree to follow safe diving practices, dive within my cert limits, and obey the divemaster's instructions.</span>
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3 pt-4 border-t border-slate-800">
                                    <label className="flex gap-3 text-xs text-slate-300 font-medium cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={padiMedicalAgreed}
                                            onChange={e => setPadiMedicalAgreed(e.target.checked)}
                                            className="w-4 h-4 rounded border-slate-700 text-cyan-400 bg-slate-800 mt-0.5"
                                        />
                                        <span>I declare that I have reviewed the PADI medical statement and will obtain a doctor's release if required.</span>
                                    </label>
                                </div>
                            )}

                            <div className="space-y-3">
                                <label className="flex gap-3 text-xs text-slate-300 font-medium cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={conductAgreed}
                                        onChange={e => setConductAgreed(e.target.checked)}
                                        className="w-4 h-4 rounded border-slate-700 text-cyan-400 bg-slate-800 mt-0.5"
                                    />
                                    <span>I agree to the code of conduct, respecting marine life, and taking nothing except trash from the ocean.</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: REVIEW & PAY */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <div className="border-b border-slate-700/60 pb-4 mb-6">
                                <h2 className="text-2xl font-bold text-white">Review & Checkout</h2>
                                <p className="text-slate-400 mt-1 text-sm" style={{ fontFamily: "system-ui, sans-serif" }}>
                                    Review booking details and submit payment.
                                </p>
                            </div>

                            <div className="bg-slate-950/60 border border-slate-800 p-5 rounded-2xl space-y-3 text-xs text-slate-300">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Activity:</span>
                                    <span className="text-white font-semibold">{bookingType === "course" ? getSelectedCourse().title : getSelectedSite().name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Date:</span>
                                    <span className="text-white font-semibold">{date ? format(date, "PPP") : ""}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Diver:</span>
                                    <span className="text-white font-semibold">{fullName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Contact Email:</span>
                                    <span className="text-white font-semibold truncate max-w-[180px]">{email}</span>
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
                            className="flex items-center justify-center gap-2 bg-cyan-400 text-slate-900 font-bold text-sm px-8 py-3 rounded-full hover:bg-cyan-300 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed transition-all duration-200 min-w-[150px] shadow-lg"
                            style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                            {isProcessing ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
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
        <div className="min-h-screen pb-20 bg-slate-950">
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

                <Suspense fallback={<div className="text-slate-400 py-20 text-center font-medium">Loading checkout system...</div>}>
                    <BookingContent />
                </Suspense>
            </div>
        </div>
    );
}