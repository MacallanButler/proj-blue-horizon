"use client";

import { useState } from "react";
import { Shield, CheckCircle2, XCircle, AlertCircle, Lock, Unlock } from "lucide-react";

interface PADIVerificationProps {
    siteId: string;
    requiredLevel: "Open Water" | "Advanced" | "Rescue" | "Divemaster";
    onVerified?: () => void;
}

// PADI number format: XX-XXXXXXX (2 digit region + 7 digit cert number)
const PADI_REGEX = /^\d{2}-\d{7}$/;

// Simulated certification level lookup based on number determinism
function getCertLevelFromNumber(num: string): string {
    const digits = num.replace("-", "");
    const sum = digits.split("").reduce((a, b) => a + parseInt(b), 0);
    const levels = ["Open Water Diver", "Advanced Open Water", "Rescue Diver", "Divemaster", "Instructor"]
    return levels[sum % levels.length];
}

const levelHierarchy: Record<string, number> = {
    "Open Water": 0,
    "Open Water Diver": 0,
    "Advanced": 1,
    "Advanced Open Water": 1,
    "Rescue": 2,
    "Rescue Diver": 2,
    "Divemaster": 3,
    "Instructor": 4,
}

export function PADIVerification({ requiredLevel, onVerified }: PADIVerificationProps) {
    const [certNumber, setCertNumber] = useState("");
    const [status, setStatus] = useState<"idle" | "checking" | "verified" | "failed" | "insufficient">("idle");
    const [certLevel, setCertLevel] = useState("");

    const handleVerify = () => {
        setStatus("checking");
        // Simulate API delay
        setTimeout(() => {
            if (!PADI_REGEX.test(certNumber)) {
                setStatus("failed");
                return;
            }
            const level = getCertLevelFromNumber(certNumber);
            setCertLevel(level);

            const userLevelRank = levelHierarchy[level] ?? 0;
            const requiredRank = levelHierarchy[requiredLevel] ?? 0;

            if (userLevelRank >= requiredRank) {
                setStatus("verified");
                onVerified?.();
            } else {
                setStatus("insufficient");
            }
        }, 1200);
    };

    return (
        <div className="bg-ocean-mid/30 border border-ocean-light/20 rounded-xl p-6 space-y-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h3 className="text-white font-bold text-base">Certification Verification</h3>
                    <p className="text-slate-400 text-xs">Required: <span className="text-primary font-semibold">{requiredLevel} Diver</span> or higher</p>
                </div>
            </div>

            {status !== "verified" ? (
                <div className="space-y-3">
                    <div>
                        <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">
                            PADI Certification Number
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={certNumber}
                                onChange={e => setCertNumber(e.target.value)}
                                placeholder="e.g. 12-3456789"
                                className="flex-1 bg-ocean-dark/50 border border-ocean-light/10 text-white text-sm px-3 py-2.5 rounded-lg placeholder:text-slate-600 focus:outline-none focus:border-primary/50 font-mono"
                                maxLength={10}
                            />
                            <button
                                onClick={handleVerify}
                                disabled={!certNumber || status === "checking"}
                                className="px-4 py-2 bg-primary text-ocean-deep font-bold text-sm rounded-lg disabled:opacity-50 hover:bg-primary/90 transition-colors flex items-center gap-2"
                            >
                                {status === "checking"
                                    ? <span className="w-4 h-4 border-2 border-ocean-deep/30 border-t-ocean-deep rounded-full animate-spin" />
                                    : <Shield className="w-4 h-4" />
                                }
                                Verify
                            </button>
                        </div>
                    </div>

                    {status === "failed" && (
                        <div className="flex gap-2 items-start p-3 rounded-lg bg-red-900/20 border border-red-500/20 text-red-400 text-sm">
                            <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>Invalid format. PADI numbers follow the format <strong>XX-XXXXXXX</strong> (e.g. 12-3456789).</span>
                        </div>
                    )}

                    {status === "insufficient" && (
                        <div className="flex gap-2 items-start p-3 rounded-lg bg-amber-900/20 border border-amber-500/20 text-amber-400 text-sm">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>
                                Your certification (<strong>{certLevel}</strong>) is below the required level for this dive site.
                                You need a <strong>{requiredLevel}</strong> certification or higher.
                            </span>
                        </div>
                    )}

                    <p className="text-[11px] text-slate-600">
                        Demo: Type any number in format XX-XXXXXXX (e.g. 42-1234567). Certification level is simulated based on the number.
                    </p>
                </div>
            ) : (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-green-900/20 border border-green-500/20">
                    <CheckCircle2 className="w-8 h-8 text-green-400 shrink-0" />
                    <div>
                        <p className="text-green-300 font-bold"># {certNumber} — Verified ✓</p>
                        <p className="text-green-400/70 text-sm">{certLevel} — Access granted to this dive site.</p>
                    </div>
                </div>
            )}

            {/* Access indicator */}
            <div className={`flex items-center gap-2 text-xs font-semibold ${status === "verified" ? "text-green-400" : "text-slate-500"}`}>
                {status === "verified" ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                {status === "verified" ? "Dive site unlocked" : "Verification required to book this site"}
            </div>
        </div>
    );
}
