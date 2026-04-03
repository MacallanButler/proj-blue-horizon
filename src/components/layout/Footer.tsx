import { Anchor, Heart } from "lucide-react";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="border-t border-slate-700/30 py-8" style={{ background: "#020d18" }}>
            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">

                <div className="flex items-center gap-2">
                    <Anchor className="h-5 w-5 text-cyan-400" />
                    <span className="text-sm font-bold text-white tracking-widest uppercase">
                        BLUE <span className="text-cyan-400">HORIZON</span>
                    </span>
                </div>

                <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400" style={{ fontFamily: "system-ui, sans-serif" }}>
                    <Link href="/dive-sites" className="hover:text-cyan-400 transition-colors">Dive Sites</Link>
                    <Link href="/courses" className="hover:text-cyan-400 transition-colors">Courses</Link>
                    <Link href="/conservation" className="hover:text-cyan-400 transition-colors">Conservation</Link>
                    <Link href="/booking" className="hover:text-cyan-400 transition-colors">Book a Dive</Link>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-500" style={{ fontFamily: "system-ui, sans-serif" }}>
                    <span>© {new Date().getFullYear()} Blue Horizon</span>
                    <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" />
                    <span>for the ocean</span>
                </div>

            </div>
        </footer>
    );
};

export default Footer;