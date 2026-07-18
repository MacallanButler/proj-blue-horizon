"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Thermometer, Eye, Calendar, Plus, Loader2, BookOpen, AlertCircle } from "lucide-react";
import { apiClient } from "@/lib/apiClient";

interface LogEntry {
  id: number;
  site: string;
  date: string;
  depth: string;
  duration: string;
  waterTemp: string;
  visibility: string;
  highlights: string;
}

export default function LogbookPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [siteName, setSiteName] = useState("");
  const [date, setDate] = useState("");
  const [depth, setDepth] = useState("");
  const [duration, setDuration] = useState("");
  const [waterTemp, setWaterTemp] = useState("");
  const [visibility, setVisibility] = useState("");
  const [highlights, setHighlights] = useState("");
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const u = await apiClient.getCurrentUser();
      setUser(u);
      if (u) {
        const [logsData, bookingsData] = await Promise.all([
          apiClient.getLogEntries(),
          apiClient.getBookings()
        ]);
        setLogs(logsData || []);
        setBookings(bookingsData || []);
        if (logsData && logsData.length > 0 && !selectedLog) {
          setSelectedLog(logsData[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load logbook data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePreFill = (booking: any) => {
    setSiteName(booking.diveSiteName || "");
    setDate(booking.tripDate ? booking.tripDate.split("T")[0] : "");
    setBookingId(booking.id);
    setShowForm(true);
    // clear other fields
    setDepth("");
    setDuration("");
    setWaterTemp("");
    setVisibility("");
    setHighlights("");
    setError("");
  };

  const handleOpenNewForm = () => {
    setSiteName("");
    setDate(new Date().toISOString().split("T")[0]);
    setBookingId(null);
    setDepth("");
    setDuration("");
    setWaterTemp("");
    setVisibility("");
    setHighlights("");
    setError("");
    setShowForm(true);
  };

  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const params = {
      booking_id: bookingId,
      site_name: siteName,
      date,
      depth: parseFloat(depth),
      duration: parseInt(duration),
      water_temp: parseInt(waterTemp),
      visibility: parseInt(visibility),
      highlights
    };

    try {
      const newLog = await apiClient.createLogEntry(params);
      setShowForm(false);
      await fetchData(); // refresh data
      setSelectedLog(newLog);
    } catch (err: any) {
      setError(err.message || "Failed to submit log entry.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-ocean-deep via-ocean-dark to-ocean-deep text-white flex justify-center items-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-ocean-deep via-ocean-dark to-ocean-deep text-white pt-28 pb-16">
        <div className="container mx-auto px-6 text-center max-w-md">
          <BookOpen className="w-16 h-16 text-primary mx-auto mb-6 opacity-80" />
          <h1 className="text-3xl font-bold mb-4">Dive Logbook</h1>
          <p className="text-slate-400 mb-8">You need to be logged in as a registered diver to view and record your dive logs.</p>
          <Link href="/booking?auth=login" className="bg-primary text-ocean-deep font-bold px-8 py-3 rounded-full text-base hover:bg-primary/95 transition-all">
            Log In or Register
          </Link>
        </div>
      </main>
    );
  }

  // Find completed bookings that do not have a log entry associated
  const loggedBookingIds = logs.map(l => l.bookingId).filter(Boolean);
  const unloggedBookings = bookings.filter(b => b.status === "completed" && !loggedBookingIds.includes(b.id));

  return (
    <main className="min-h-screen bg-gradient-to-b from-ocean-deep via-ocean-dark to-ocean-deep text-white">
      <div className="container mx-auto px-6 pt-28 pb-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <button
            onClick={handleOpenNewForm}
            className="bg-primary text-ocean-deep font-bold px-5 py-2.5 rounded-full hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Log a Dive
          </button>
        </div>

        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
          Dive <span className="text-primary">Logbook</span>
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl mb-12">
          Track your underwater adventures. Record highlights, depth, visibility, and water conditions.
        </p>

        {/* Unlogged bookings warning/assistant */}
        {unloggedBookings.length > 0 && (
          <div className="mb-10 bg-primary/10 border border-primary/20 rounded-xl p-5">
            <h3 className="text-primary font-bold mb-2 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              You have unlogged dive trips!
            </h3>
            <p className="text-slate-300 text-sm mb-4">
              We found completed trips that haven't been logged yet. Click one below to pre-fill site and date:
            </p>
            <div className="flex flex-wrap gap-3">
              {unloggedBookings.map((b) => (
                <button
                  key={b.id}
                  onClick={() => handlePreFill(b)}
                  className="bg-ocean-dark/80 hover:bg-ocean-light/50 border border-ocean-light/20 rounded-lg px-4 py-2 text-xs text-left transition-all flex items-center gap-2"
                >
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <div>
                    <span className="font-semibold block">{b.diveSiteName}</span>
                    <span className="text-[10px] text-slate-400">{b.tripDate ? b.tripDate.split("T")[0] : ""}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {showForm && (
          <div className="mb-10 bg-ocean-mid/40 border border-primary/30 rounded-xl p-8 backdrop-blur-sm max-w-2xl">
            <h2 className="text-2xl font-bold mb-6 text-primary flex items-center gap-2">
              <Plus className="w-6 h-6" />
              {bookingId ? "Log Completed Booking" : "Log a New Dive"}
            </h2>
            <form onSubmit={handleLogSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Site Name</label>
                  <input
                    type="text"
                    value={siteName}
                    onChange={e => setSiteName(e.target.value)}
                    className="w-full bg-ocean-dark/60 border border-ocean-light/20 text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                    placeholder="e.g. Blue Corner"
                    disabled={!!bookingId} // lock if linked to booking
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-ocean-dark/60 border border-ocean-light/20 text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                    disabled={!!bookingId}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Depth (m)</label>
                  <input
                    type="number"
                    value={depth}
                    onChange={e => setDepth(e.target.value)}
                    className="w-full bg-ocean-dark/60 border border-ocean-light/20 text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                    placeholder="e.g. 30"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Duration (min)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                    className="w-full bg-ocean-dark/60 border border-ocean-light/20 text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                    placeholder="e.g. 45"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Water Temp (°C)</label>
                  <input
                    type="number"
                    value={waterTemp}
                    onChange={e => setWaterTemp(e.target.value)}
                    className="w-full bg-ocean-dark/60 border border-ocean-light/20 text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                    placeholder="e.g. 26"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Visibility (m)</label>
                  <input
                    type="number"
                    value={visibility}
                    onChange={e => setVisibility(e.target.value)}
                    className="w-full bg-ocean-dark/60 border border-ocean-light/20 text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50"
                    placeholder="e.g. 20"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Highlights & Notes</label>
                <textarea
                  value={highlights}
                  onChange={e => setHighlights(e.target.value)}
                  className="w-full bg-ocean-dark/60 border border-ocean-light/20 text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-primary/50 h-24"
                  placeholder="What did you see? Sharks, currents, topography, coral..."
                  required
                />
              </div>

              {error && (
                <div className="flex gap-2 items-start p-3 rounded-lg bg-red-950/20 border border-red-500/20 text-red-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-slate-600 rounded-lg hover:border-slate-400 text-slate-300 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-primary text-ocean-deep font-bold rounded-lg hover:bg-primary/95 text-sm flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Log Entry
                </button>
              </div>
            </form>
          </div>
        )}

        {logs.length === 0 ? (
          <div className="text-center p-12 bg-ocean-mid/20 border border-ocean-light/10 rounded-xl">
            <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">No Dive Logs Yet</h3>
            <p className="text-slate-400 text-sm mb-4">Click "Log a Dive" above to record your first dive details.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Logs List */}
            <div className="lg:col-span-1 space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {logs.map((log) => (
                <button
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className={`w-full text-left bg-ocean-dark/50 backdrop-blur border rounded-xl p-5 transition-all ${
                    selectedLog?.id === log.id
                      ? "border-primary"
                      : "border-ocean-light/20 hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="font-bold text-white text-sm">{log.site}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    {log.date ? log.date.split("T")[0] : ""}
                  </div>
                  <div className="flex gap-4 text-[10px] text-slate-400">
                    <span>Depth: {log.depth}</span>
                    <span>Duration: {log.duration}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Log Detail */}
            <div className="lg:col-span-2">
              {selectedLog ? (
                <div className="bg-ocean-mid/30 backdrop-blur border border-ocean-light/20 rounded-xl p-8 space-y-6">
                  <div>
                    <span className="text-primary text-xs font-semibold uppercase tracking-wider block mb-1">Dive Site</span>
                    <h2 className="text-3xl font-heading font-bold text-white">{selectedLog.site}</h2>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-y border-ocean-light/10 py-5">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Depth</span>
                      <span className="font-bold text-white text-lg">{selectedLog.depth}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Duration</span>
                      <span className="font-bold text-white text-lg">{selectedLog.duration}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Water Temp</span>
                      <span className="font-bold text-white text-lg flex items-center gap-1">
                        <Thermometer className="w-4 h-4 text-primary" />
                        {selectedLog.waterTemp}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Visibility</span>
                      <span className="font-bold text-white text-lg flex items-center gap-1">
                        <Eye className="w-4 h-4 text-primary" />
                        {selectedLog.visibility}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-primary text-xs font-semibold uppercase tracking-wider block mb-2">Highlights & Notes</span>
                    <p className="text-slate-300 leading-relaxed whitespace-pre-line text-sm">{selectedLog.highlights}</p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center h-48 border border-dashed border-ocean-light/20 rounded-xl text-slate-500 text-sm">
                  Select a dive log to see details.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
