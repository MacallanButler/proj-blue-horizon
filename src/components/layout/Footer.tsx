import { Anchor, Heart } from "lucide-react";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="bg-ocean-deep border-t border-ocean-light/10 py-8">
            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                
                <div className="flex items-center gap-2">
                    <Anchor className="h-5 w-5 text-primary" />
                    <span className="text-sm font-bold text-white">
                        BLUE <span className="text-primary">HORIZON</span>
                    </span>
                </div>

                <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
                    <Link href="/dive-sites" className="hover:text-primary transition-colors">Dive Sites</Link>
                    <Link href="/courses" className="hover:text-primary transition-colors">Courses</Link>
                    <Link href="/conservation" className="hover:text-primary transition-colors">Conservation</Link>
                    <Link href="#" className="hover:text-primary transition-colors">About</Link>
                    <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>© {new Date().getFullYear()} Blue Horizon</span>
                    <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" />
                    <span>for the ocean</span>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
