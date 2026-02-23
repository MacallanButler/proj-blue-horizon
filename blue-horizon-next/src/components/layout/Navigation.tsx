"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Navigation = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const navLinks = [
        { name: "Dive Sites", path: "/dive-sites" },
        { name: "Courses", path: "/courses" },
        { name: "Conservation", path: "/conservation" },
        { name: "Logbook", path: "/logbook" },
    ];

    return (
        <nav
            className={cn(
                "fixed top-0 z-50 w-full transition-all duration-300 border-b border-transparent",
                isScrolled
                    ? "bg-ocean-dark/95 backdrop-blur-md border-ocean-light/20 py-3"
                    : "bg-transparent py-5"
            )}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <img src="/src/assets/branding/blue-horizon.png" alt="Blue Horizon" className="h-10 w-auto transition-transform group-hover:scale-105" />
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.path}
                            className="text-sm font-medium text-slate-200 hover:text-primary transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Button asChild variant="default" className="bg-primary text-ocean-deep hover:bg-primary/90 font-bold">
                        <Link href="/booking">Book a Dive</Link>
                    </Button>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-ocean-dark border-b border-ocean-light/20 shadow-xl">
                    <div className="flex flex-col p-6 gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.path}
                                className="text-lg font-medium text-slate-200 hover:text-primary"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Button asChild className="w-full bg-primary text-ocean-deep font-bold mt-4">
                            <Link href="/booking">Book a Dive</Link>
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navigation;
