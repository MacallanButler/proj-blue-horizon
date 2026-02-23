import { Anchor, Heart } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-ocean-deep border-t border-ocean-light/10 pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Anchor className="h-6 w-6 text-primary" />
                            <span className="text-lg font-heading font-bold text-white">
                                BLUE <span className="text-primary">HORIZON</span>
                            </span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Explore the depths responsibly. We are committed to marine conservation and sustainable diving practices.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4">Explore</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><a href="#" className="hover:text-primary transition-colors">Dive Sites</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Courses</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Liveaboards</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Photography</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Our Team</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4">Conservation</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><a href="#" className="hover:text-primary transition-colors">Project AWARE</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Reef Check</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Green Fins</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-ocean-light/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm">
                        © {new Date().getFullYear()} Blue Horizon. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span>Made with</span>
                        <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                        <span>for the ocean</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
