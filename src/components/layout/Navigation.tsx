"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/apiClient";
import AuthDialog from "../features/AuthDialog";

const Navigation = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [authTab, setAuthTab] = useState<"login" | "signup">("login");
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        
        // Fetch current user auth state
        apiClient.getCurrentUser()
            .then(setUser)
            .catch(console.error);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        try {
            await apiClient.logout();
            setUser(null);
            window.location.reload();
        } catch (err) {
            console.error("Failed to log out", err);
        }
    };

    const navLinks = [
        { name: "Dive Sites", path: "/dive-sites" },
        { name: "Courses", path: "/courses" },
        { name: "Conservation", path: "/conservation" },
        ...(user ? [{ name: "Logbook", path: "/logbook" }] : [])
    ];

    return (
        <nav
            className={cn(
                "fixed top-0 z-50 w-full transition-all duration-300 border-b border-transparent",
                isScrolled
                    ? "bg-slate-950/95 backdrop-blur-md border-slate-700/30 py-3"
                    : "bg-transparent py-5"
            )}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <span className="text-2xl font-bold text-white tracking-widest uppercase transition-transform group-hover:scale-105">
                        BLUE <span className="text-cyan-400">HORIZON</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.path}
                            className={cn(
                                "text-sm font-medium transition-colors",
                                pathname === link.path
                                    ? "text-cyan-400"
                                    : "text-slate-300 hover:text-cyan-400"
                            )}
                            style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                            {link.name}
                        </Link>
                    ))}
                    
                    {user ? (
                        <div className="flex items-center gap-4 border-l border-slate-700/40 pl-6">
                            <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5" style={{ fontFamily: "system-ui, sans-serif" }}>
                                <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
                                {user.name}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="text-xs text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1 font-semibold"
                                style={{ fontFamily: "system-ui, sans-serif" }}
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                Log Out
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => { setAuthTab("login"); setIsAuthOpen(true); }}
                            className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1"
                            style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                            <LogIn className="w-4 h-4" />
                            Log In
                        </button>
                    )}

                    <Link
                        href="/booking"
                        className="bg-cyan-400 text-slate-900 font-bold text-sm px-5 py-2 rounded-full hover:bg-cyan-300 transition-colors duration-200"
                        style={{ fontFamily: "system-ui, sans-serif" }}
                    >
                        Book a Dive
                    </Link>
                </div>

                <button
                    className="md:hidden text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-700/30 shadow-xl">
                    <div className="flex flex-col p-6 gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.path}
                                className="text-lg font-medium text-slate-200 hover:text-cyan-400 transition-colors"
                                style={{ fontFamily: "system-ui, sans-serif" }}
                            >
                                {link.name}
                            </Link>
                        ))}
                        
                        {user ? (
                            <div className="border-t border-slate-800 pt-4 flex flex-col gap-3">
                                <span className="text-sm text-slate-300 font-medium">Logged in as {user.name}</span>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left text-red-400 hover:text-red-300 transition-colors text-sm font-bold flex items-center gap-2"
                                    style={{ fontFamily: "system-ui, sans-serif" }}
                                >
                                    <LogOut className="w-4 h-4" />
                                    Log Out
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => { setAuthTab("login"); setIsAuthOpen(true); }}
                                className="w-full text-left text-slate-200 hover:text-cyan-400 transition-colors text-sm font-bold flex items-center gap-2 border-t border-slate-800 pt-4"
                                style={{ fontFamily: "system-ui, sans-serif" }}
                            >
                                <LogIn className="w-4 h-4" />
                                Log In
                            </button>
                        )}

                        <Link
                            href="/booking"
                            className="w-full text-center bg-cyan-400 text-slate-900 font-bold text-sm px-5 py-3 rounded-full hover:bg-cyan-300 transition-colors duration-200 mt-2"
                            style={{ fontFamily: "system-ui, sans-serif" }}
                        >
                            Book a Dive
                        </Link>
                    </div>
                </div>
            )}

            <AuthDialog
                isOpen={isAuthOpen}
                onClose={() => setIsAuthOpen(false)}
                defaultTab={authTab}
            />
        </nav>
    );
};

export default Navigation;