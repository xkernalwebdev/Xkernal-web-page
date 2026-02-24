import React, { useEffect, useRef, useState } from "react";
import TiltCard from "../../components/TiltCard.jsx";
import { TEAMS_DATA } from "./teamsData.js";

const getRoleColor = (role) => {
    if (role.includes("President") || role.includes("Faculty") || role.includes("Secretary")) return "text-[#6bdbd1]";
    if (role.includes("Lead")) return "text-[#05acc1]";
    return "text-gray-400";
};

const getRoleBg = (role) => {
    if (role.includes("President") || role.includes("Faculty") || role.includes("Secretary")) return "bg-[#6bdbd1]/10 border-[#6bdbd1]/30";
    if (role.includes("Lead")) return "bg-[#05acc1]/10 border-[#05acc1]/30";
    return "bg-white/5 border-white/10";
};

const DomainSection = ({ domainData }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entry.target);
            }
        }, { threshold: 0.1 });

        const currentRef = ref.current;
        if (currentRef) observer.observe(currentRef);
        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, []);

    return (
        <div ref={ref} className={`space-y-6 transition-all duration-1000 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {domainData.members.map((member, mIndex) => (
                    <div
                        key={mIndex}
                        className={`h-full transition-all duration-700 ease-out transform ${isVisible ? "opacity-100 map-y-0" : "opacity-0 translate-y-8"}`}
                        style={{ transitionDelay: `${mIndex * 100}ms` }}
                    >
                        <TiltCard intensity={3} className="h-full">
                            <div className="h-full relative flex flex-col p-6 rounded-2xl bg-[#080c0a]/90 backdrop-blur-xl border border-[#05acc1]/30 hover:border-[#05acc1]/60 transition-all duration-500 group overflow-hidden shadow-[0_0_15px_rgba(5,172,193,0.15)] hover:shadow-[0_0_30px_rgba(5,172,193,0.4)]">
                                {/* Background glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#05acc1]/10 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>

                                {/* Grid Pattern */}
                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSI+PC9yZWN0Pgo8cGF0aCBkPSJNMCAyMEwyMCAyMEwyMCAwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMSkiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>

                                <div className="absolute top-0 right-0 p-4 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                                    <svg className="w-5 h-5 text-[#05acc1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>

                                <div className="relative z-10 flex-1 flex flex-col justify-center mt-2">
                                    <h4 className="text-lg sm:text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#05acc1] group-hover:to-[#6bdbd1] transition-all duration-300 mb-2">
                                        {member.name}
                                    </h4>

                                    <div className="flex flex-wrap gap-2">
                                        <span className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-lg border ${getRoleBg(member.role)} ${getRoleColor(member.role)} shadow-inner`}>
                                            {member.role}
                                        </span>
                                        {member.dept && (
                                            <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-lg border bg-white/5 border-white/10 text-gray-400 shadow-inner">
                                                {member.dept}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Glowing bottom bar */}
                                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#05acc1] via-[#6bdbd1] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700"></div>
                            </div>
                        </TiltCard>
                    </div>
                ))}
            </div>
        </div>
    );
};

const LandingTeam = () => {
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setActiveTab((prev) => (prev + 1) % TEAMS_DATA.length);
        }, 4000); // 4 seconds per domain

        return () => clearTimeout(timer);
    }, [activeTab]);

    const handleTabClick = (index) => {
        setActiveTab(index);
    };

    return (
        <section id="teams" className="py-20 sm:py-24 pointer-events-auto border-t border-white/5 relative z-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
                    <div>
                        <h2 className="text-[#05acc1] text-xs font-bold tracking-[0.3em] uppercase mb-3">
                            Core Committee
                        </h2>
                        <p className="text-2xl sm:text-3xl md:text-4xl font-bold">
                            The Minds Behind X-Kernel.
                        </p>
                    </div>
                    <div className="text-[10px] sm:text-xs font-mono text-gray-500 border border-white/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full self-start">
                        ./execute_team_protocol
                    </div>
                </div>

                {/* DOMAIN TABS */}
                <div className="flex flex-wrap items-center pb-4 mb-8 sm:mb-12 gap-2 sm:gap-4 border-b border-white/5">
                    {TEAMS_DATA.map((domainData, index) => (
                        <button
                            key={index}
                            onClick={() => handleTabClick(index)}
                            className={`px-4 py-2 text-xs sm:text-sm font-bold uppercase tracking-widest rounded-lg transition-all relative overflow-hidden ${activeTab === index
                                ? "text-[#05acc1] bg-[#05acc1]/10 border border-[#05acc1]/30 shadow-[0_0_15px_rgba(5,172,193,0.2)]"
                                : "text-gray-500 hover:text-white hover:bg-white/5 border border-transparent"
                                }`}
                        >
                            {domainData.domain}

                            {/* Active Tab Indicator */}
                            {activeTab === index && (
                                <div className="absolute left-0 bottom-0 w-full h-[2px] bg-[#05acc1]"></div>
                            )}

                            {/* Progress bar for auto-play */}
                            {activeTab === index && (
                                <div key={activeTab} className="absolute left-0 bottom-0 h-[2px] bg-white opacity-40 animate-progress"></div>
                            )}
                        </button>
                    ))}
                </div>

                {/* ACTIVE DOMAIN CONTENT */}
                <div className="min-h-[400px]">
                    <div key={activeTab} className="animate-fade-in animate-slide-up">
                        <DomainSection domainData={TEAMS_DATA[activeTab]} />
                    </div>
                </div>
            </div>

            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                @keyframes fadeUp {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                
                @keyframes progress {
                    0% { width: 0%; }
                    100% { width: 100%; }
                }
                .animate-progress { animation: progress 4s linear forwards; }
            `}</style>
        </section>
    );
};

export default LandingTeam;
