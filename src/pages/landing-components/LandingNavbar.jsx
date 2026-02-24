import React from "react";
import { scrollToId } from "./utils";

const LandingNavbar = ({ navigate }) => (
    <header className="fixed inset-x-0 top-0 z-[100] transition-all duration-300 pointer-events-none">
        <div className="absolute inset-0 bg-transparent pointer-events-auto" />
        <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4 pointer-events-auto">
            <button
                onClick={() => scrollToId("hero")}
                className="flex items-center gap-3 group"
            >
                <div className="relative h-9 w-9 sm:h-10 sm:w-10 overflow-hidden rounded-xl bg-gradient-to-br from-[#05acc1] to-[#09969f] p-[1px]">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    <div className="h-full w-full bg-[#020403] rounded-[10px] flex items-center justify-center font-black text-[#05acc1]">
                        X
                    </div>
                </div>
                <div className="text-left">
                    <p className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-white group-hover:text-[#05acc1] transition-colors">
                        X‑Kernel
                    </p>
                    <p className="text-[9px] text-gray-500 font-mono">
                        GRIET MAINFRAME
                    </p>
                </div>
            </button>

            <nav className="hidden md:flex items-center gap-8 text-[11px] font-bold tracking-[0.15em] uppercase text-gray-400">
                {["Home", "About Us", "Team", "Events"].map((id) => (
                    <button
                        key={id}
                        onClick={() => {
                            if (id === "Home") scrollToId("hero");
                            else if (id === "About Us") scrollToId("about");
                            else if (id === "Team") scrollToId("teams");
                            else scrollToId("events");
                        }}
                        className="hover:text-white transition-colors relative group"
                    >
                        {id}
                        <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#05acc1] transition-all group-hover:w-full" />
                    </button>
                ))}
                <button
                    onClick={() => scrollToId("past-events")}
                    className="hover:text-white transition-colors relative group"
                >
                    Past Events
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#6bdbd1] transition-all group-hover:w-full" />
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
                    onClick={() => scrollToId("past-events")}
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

export default LandingNavbar;
