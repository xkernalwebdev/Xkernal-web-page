import React from "react";
import { useLocation } from "react-router-dom";
import { scrollToId } from "./utils";

const LandingNavbar = ({ navigate }) => {
    const location = useLocation();
    const isLandingPage = location.pathname === "/";

    const handleNavigation = (targetId) => {
        if (isLandingPage) {
            scrollToId(targetId);
        } else {
            navigate(`/#${targetId}`);
        }
    };

    return (
    <header className="fixed inset-x-0 top-0 z-[100] transition-all duration-300 pointer-events-none">
        <div className="absolute inset-0 bg-transparent pointer-events-auto" />
        <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4 pointer-events-auto">
            <button
                onClick={() => handleNavigation("hero")}
                className="flex items-center gap-3 group"
            >
                <img
                    src="https://res.cloudinary.com/dynpwzjch/image/upload/v1771761776/ChatGPT_Image_Feb_22_2026_05_32_34_PM_mnmbnl.png"
                    alt="X-Kernel Logo"
                    className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover border border-[#05acc1]/30 hover:border-[#05acc1]/60 transition-all hover:shadow-[0_0_10px_rgba(5,172,193,0.4)]"
                />
                <div className="text-left">
                    <p className="text-sm sm:text-lg font-bold tracking-[0.2em] uppercase text-white group-hover:text-[#05acc1] transition-colors">
                        X-Kernel
                    </p>
                    <p className="text-[8px] sm:text-[10px] text-gray-500 font-mono">
                        GRIET MAINFRAME
                    </p>
                </div>
            </button>

            <nav className="hidden md:flex items-center gap-8 text-[11px] font-bold tracking-[0.15em] uppercase text-gray-400">
                {["Home", "About Us", "Team", "Events"].map((id) => (
                    <button
                        key={id}
                        onClick={() => {
                            if (id === "Home") handleNavigation("hero");
                            else if (id === "About Us") handleNavigation("about");
                            else if (id === "Team") handleNavigation("teams");
                            else handleNavigation("events");
                        }}
                        className="hover:text-white transition-colors relative group"
                    >
                        {id}
                        <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#05acc1] transition-all group-hover:w-full" />
                    </button>
                ))}
                <button
                    onClick={() => handleNavigation("past-events")}
                    className="hover:text-white transition-colors relative group"
                >
                    Past Events
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#6bdbd1] transition-all group-hover:w-full" />
                </button>
                <button
                    onClick={() => navigate("/sponsors")}
                    className="hover:text-white transition-colors relative group"
                >
                    Sponsors
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#05acc1] transition-all group-hover:w-full" />
                </button>
                <button
                    onClick={() => navigate("/login")}
                    className="px-5 py-2 bg-white text-[#020403] rounded-full hover:bg-[#05acc1] hover:text-white hover:shadow-[0_0_20px_rgba(5,172,193,0.6)] transition-all transform hover:scale-105"
                >
                    LOGIN
                </button>
            </nav>

            {/* Mobile buttons */}
            <div className="md:hidden flex items-center gap-2">
                <button
                    onClick={() => handleNavigation("past-events")}
                    className="px-3 py-1.5 text-[11px] rounded-full border border-white/10 text-gray-300 font-semibold hover:border-[#6bdbd1]/50 hover:text-[#6bdbd1] transition-all"
                >
                    Archive
                </button>
                <button
                    onClick={() => navigate("/login")}
                    className="px-3 py-1.5 text-[11px] rounded-full bg-white text-[#020403] font-semibold"
                >
                    Login
                </button>
            </div>
        </div>
    </header>
    );
};

export default LandingNavbar;
