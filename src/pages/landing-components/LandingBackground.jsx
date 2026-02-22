// src/pages/landing-components/LandingBackground.jsx
import React from "react";

const LandingBackground = () => (
    <div className="fixed inset-0 z-0 overflow-hidden bg-black pointer-events-auto">
        {/* Soft Blue highlights and gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#05acc1] rounded-full mix-blend-screen blur-[140px] opacity-20 animate-blob transform-gpu will-change-transform pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-[#004d61] rounded-full mix-blend-screen blur-[140px] opacity-30 animate-blob animation-delay-2000 transform-gpu will-change-transform pointer-events-none" />
        <div className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] bg-[#09969f] rounded-full mix-blend-screen blur-[120px] opacity-15 animate-blob animation-delay-4000 transform-gpu will-change-transform pointer-events-none" />

        {/* Fullscreen Translucent Frosted Glass Panel */}
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[12px] pointer-events-none" />

        {/* High-res Minimalistic UI Noise overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 pointer-events-none mix-blend-overlay" />
    </div>
);

export default LandingBackground;
