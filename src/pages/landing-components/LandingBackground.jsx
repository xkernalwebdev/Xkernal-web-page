import React, { useMemo } from "react";

const LandingBackground = () => {
    const lightningSvg = (
        <svg width="1em" height="1em" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    );

    const rocketSvg = (
        <svg width="1em" height="1em" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.59 14.37a6 6 0 01-5.84 7.36c-5.26 0-8.91-4.82-7.39-9.8a6 6 0 017.36-5.84l.8.8c.84-.71 2.05-.33 2.5.76l2.12 2.12c1.09.45 1.47 1.66.76 2.5l.8.8zM20.24 3.76a3 3 0 00-4.24 0l-3.5 3.5a3 3 0 004.24 4.24l3.5-3.5a3 3 0 000-4.24zM10 14l4 4" />
        </svg>
    );

    // Sparse array of minimal tech symbols with varying positions and animation types
    const symbols = useMemo(() => [
        { char: "< />", top: "15%", left: "12%", animation: "float1", delay: "0s", size: "text-2xl" },
        { char: "{ }", top: "25%", left: "82%", animation: "float2", delay: "2s", size: "text-3xl" },
        { char: lightningSvg, top: "70%", left: "15%", animation: "float3", delay: "4s", size: "text-2xl" },
        { char: "△", top: "82%", left: "80%", animation: "float1", delay: "1s", size: "text-2xl" },
        { char: "◯", top: "45%", left: "88%", animation: "float2", delay: "3s", size: "text-xl" },
        { char: "□", top: "52%", left: "8%", animation: "float3", delay: "6s", size: "text-2xl" },
        { char: rocketSvg, top: "12%", left: "55%", animation: "float2", delay: "0s", size: "text-3xl" },
        { char: ">", top: "85%", left: "42%", animation: "float1", delay: "5s", size: "text-2xl" },
        { char: lightningSvg, top: "35%", left: "30%", animation: "float3", delay: "2.5s", size: "text-xl" },
        { char: "//", top: "75%", left: "60%", animation: "float2", delay: "1.5s", size: "text-2xl" },
        { char: "< >", top: "40%", left: "50%", animation: "float1", delay: "8s", size: "text-xl" },
    ], []);

    return (
        <div className="fixed inset-0 z-0 overflow-hidden bg-gradient-to-br from-[#020b18] via-[#01040a] to-[#010204] pointer-events-auto">

            {/* Subtle Grid Layout */}
            <div
                className="absolute inset-0 z-0 opacity-[0.06]"
                style={{
                    backgroundImage: `linear-gradient(to right, #00AEEF 1px, transparent 1px), linear-gradient(to bottom, #00AEEF 1px, transparent 1px)`,
                    backgroundSize: '60px 60px'
                }}
            />

            {/* Ambient light blooms (Subtle glow) */}
            <div className="absolute top-[-15%] left-[-10%] w-[50vw] h-[50vw] bg-[#00AEEF] rounded-full mix-blend-screen blur-[200px] opacity-[0.08] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-15%] w-[60vw] h-[60vw] bg-[#00AEEF] rounded-full mix-blend-screen blur-[220px] opacity-[0.06] pointer-events-none" />
            <div className="absolute top-[40%] left-[35%] w-[40vw] h-[40vw] bg-[#00AEEF] rounded-full mix-blend-screen blur-[180px] opacity-[0.04] pointer-events-none" />

            {/* Glowing UI Symbols / Shapes */}
            {symbols.map((sym, i) => (
                <div
                    key={i}
                    className={`absolute text-[#00AEEF] font-mono leading-none flex items-center justify-center opacity-[0.4] drop-shadow-[0_0_15px_rgba(0,174,239,1)] filter blur-[0.4px] ${sym.size}`}
                    style={{
                        top: sym.top,
                        left: sym.left,
                        // 8-15s duration: using base 9s plus a variation based on index
                        animation: `${sym.animation} ${9 + (i % 6)}s ease-in-out infinite`,
                        animationDelay: sym.delay,
                    }}
                >
                    {sym.char}
                </div>
            ))}

            <style>{`
                @keyframes float1 {
                    0%, 100% { transform: translateY(0) translateX(0) scale(1); }
                    50% { transform: translateY(-40px) translateX(25px) scale(1.05); }
                }
                @keyframes float2 {
                    0%, 100% { transform: translateY(0) translateX(0) scale(1); }
                    50% { transform: translateY(45px) translateX(-20px) scale(0.95); }
                }
                @keyframes float3 {
                    0%, 100% { transform: translateY(0) translateX(0) scale(1); }
                    50% { transform: translateY(-30px) translateX(-35px) scale(1.08); }
                }
            `}</style>
        </div>
    );
};

export default LandingBackground;
