"use client";

import { useState, useEffect } from "react";
import { Shield, CheckCircle2, AlertCircle, Lock, Unlock, Upload, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/apiClient";

interface PADIVerificationProps {
  siteId: string;
  requiredLevel: "Open Water" | "Advanced" | "Rescue" | "Divemaster" | "Expert";
  onVerified?: () => void;
}

const PADI_REGEX = /^\d{2}-\d{7}$/;

const levelHierarchy: Record<string, number> = {
  "open_water": 0,
  "advanced": 1,
  "rescue": 2,
  "divemaster": 3,
  "instructor": 4
};

const requiredLevelMap: Record<string, string> = {
  "Open Water": "open_water",
  "Advanced": "advanced",
  "Rescue": "rescue",
  "Divemaster": "divemaster",
  "Expert": "rescue"
};

export default function PADIVerification({ requiredLevel, onVerified }: PADIVerificationProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [certNumber, setCertNumber] = useState("");
  const [certLevel, setCertLevel] = useState("open_water");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const fetchUser = async () => {
    try {
      const data = await apiClient.getCurrentUser();
      setUser(data);
      if (data) {
        // Pre-fill if exists
        setCertNumber(data.padiCertNumber || "");
        setCertLevel(data.padiCertLevel || "open_water");

        // Check if already verified or valid cert is on file
        const requiredRank = levelHierarchy[requiredLevelMap[requiredLevel]] || 0;
        const userRank = levelHierarchy[data.padiCertLevel] || -1;
        if (data.certVerifiedByStaff || (userRank >= requiredRank)) {
          onVerified?.();
        }
      }
    } catch (err) {
      console.error("Failed to load user profile", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [requiredLevel]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!PADI_REGEX.test(certNumber)) {
      setError("Invalid format. PADI number must follow the format XX-XXXXXXX (e.g. 12-3456789).");
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiClient.submitCert(certNumber, certLevel, selectedFile || undefined);
      setUser(res.user);
      
      const requiredRank = levelHierarchy[requiredLevelMap[requiredLevel]] || 0;
      const userRank = levelHierarchy[res.user.padiCertLevel] || -1;
      
      if (userRank >= requiredRank) {
        onVerified?.();
      } else {
        setError(`Submitted successfully, but your level (${certLevel.replace("_", " ").toUpperCase()}) is lower than required.`);
      }
    } catch (err: any) {
      setError(err.message || "Failed to submit certification.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-ocean-mid/30 border border-ocean-light/20 rounded-xl p-8 flex justify-center items-center backdrop-blur-sm">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  // Not logged in state
  if (!user) {
    return (
      <div className="bg-ocean-mid/30 border border-ocean-light/20 rounded-xl p-6 space-y-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-white font-bold text-base">Certification Check</h3>
            <p className="text-slate-400 text-xs">Required: <span className="text-primary font-semibold">{requiredLevel} Diver</span> or higher</p>
          </div>
        </div>
        <div className="p-4 rounded-lg bg-cyan-900/10 border border-cyan-500/20 text-slate-300 text-sm">
          <p className="mb-2">Guests can only book beginner (Open Water) sites. Log in to verify your PADI credentials and book advanced dive sites.</p>
          <a href="/booking?auth=login" className="text-primary font-semibold hover:underline">Log in now &rarr;</a>
        </div>
      </div>
    );
  }

  const isVerified = user.certVerifiedByStaff;
  const hasSubmitted = !!user.padiCertNumber;
  const userRank = levelHierarchy[user.padiCertLevel] || -1;
  const requiredRank = levelHierarchy[requiredLevelMap[requiredLevel]] || 0;
  const meetsRequirements = userRank >= requiredRank;

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

      {isVerified ? (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-green-950/20 border border-green-500/20">
          <CheckCircle2 className="w-8 h-8 text-green-400 shrink-0" />
          <div>
            <p className="text-green-300 font-bold">Verified PADI Cert ✓</p>
            <p className="text-green-400/80 text-sm">
              #{user.padiCertNumber} — {user.padiCertLevel.replace("_", " ").toUpperCase()}
            </p>
            <p className="text-xs text-green-500/70 mt-1">Access granted to all compatible sites.</p>
          </div>
        </div>
      ) : hasSubmitted ? (
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-950/20 border border-amber-500/20">
            <AlertCircle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-300 font-bold">Submitted — Pending Staff Review</p>
              <p className="text-amber-400/80 text-sm">
                #{user.padiCertNumber} — {user.padiCertLevel.replace("_", " ").toUpperCase()}
              </p>
              <p className="text-xs text-slate-400 mt-2">
                {meetsRequirements 
                  ? "You can still book this trip! Staff will verify your card before the departure date." 
                  : `This site requires ${requiredLevel} Diver. Your submitted cert level is insufficient.`}
              </p>
            </div>
          </div>
          
          {!meetsRequirements && (
            <button
              onClick={() => {
                // Clear locally to show form again for corrections
                setUser({ ...user, padiCertNumber: null });
              }}
              className="text-xs text-primary hover:underline"
            >
              Submit a different certification &rarr;
            </button>
          )}
        </div>
      ) : (
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">
                PADI Certification Number
              </label>
              <input
                type="text"
                value={certNumber}
                onChange={e => setCertNumber(e.target.value)}
                placeholder="e.g. 12-3456789"
                className="w-full bg-ocean-dark/50 border border-ocean-light/10 text-white text-sm px-3 py-2.5 rounded-lg placeholder:text-slate-600 focus:outline-none focus:border-primary/50 font-mono"
                maxLength={10}
                required
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">
                Certification Level
              </label>
              <select
                value={certLevel}
                onChange={e => setCertLevel(e.target.value)}
                className="w-full bg-ocean-dark/50 border border-ocean-light/10 text-slate-200 text-sm px-3 py-2.5 rounded-lg focus:outline-none focus:border-primary/50"
              >
                <option value="open_water">Open Water Diver</option>
                <option value="advanced">Advanced Open Water</option>
                <option value="rescue">Rescue Diver</option>
                <option value="divemaster">Divemaster</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">
                Upload Certification Card Photo (Optional)
              </label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2.5 bg-ocean-light/40 border border-ocean-light/20 rounded-lg cursor-pointer hover:bg-ocean-light/60 transition-colors text-xs text-slate-300">
                  <Upload className="w-4 h-4 text-primary" />
                  <span>{selectedFile ? selectedFile.name : "Choose Photo"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {error && (
              <div className="flex gap-2 items-start p-3 rounded-lg bg-red-950/20 border border-red-500/20 text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-primary text-ocean-deep font-bold text-sm rounded-lg disabled:opacity-50 hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Submit Certification
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Access indicator */}
      <div className={`flex items-center gap-2 text-xs font-semibold ${isVerified || (hasSubmitted && meetsRequirements) ? "text-green-400" : "text-slate-500"}`}>
        {isVerified || (hasSubmitted && meetsRequirements) ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
        {isVerified 
          ? "Dive site unlocked (Verified)" 
          : (hasSubmitted && meetsRequirements)
            ? "Access approved (Pending review)" 
            : "Verification required to book this site"}
      </div>
    </div>
  );
}
