import React, { useRef } from "react";

// --- OPTIMIZED 3D TILT COMPONENT ---
// Changed from useState to useRef for Direct DOM manipulation to prevent scroll lag
const TiltCard = ({ children, className = "", intensity = 15 }) => {
    const cardRef = useRef(null);
    const glowRef = useRef(null);
    const requestRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;

        // Use requestAnimationFrame to throttle updates and sync with refresh rate
        cancelAnimationFrame(requestRef.current);
        requestRef.current = requestAnimationFrame(() => {
            const { left, top, width, height } = cardRef.current.getBoundingClientRect();
            const x = e.clientX - left;
            const y = e.clientY - top;

            const rotateX = ((y - height / 2) / height) * -intensity;
            const rotateY = ((x - width / 2) / width) * intensity;

            const glowX = (x / width) * 100;
            const glowY = (y / height) * 100;

            // Direct DOM update avoids React Re-render Cycle
            cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

            if (glowRef.current) {
                glowRef.current.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(5, 172, 193, 0.15), transparent 70%)`;
            }
        });
    };

    const handleMouseLeave = () => {
        if (cardRef.current) {
            cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
        }
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`relative transition-transform duration-200 ease-out preserve-3d group ${className}`}
            style={{
                transformStyle: "preserve-3d",
                willChange: "transform", // Hint to browser for optimization
            }}
        >
            <div
                ref={glowRef}
                className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[inherit]"
                style={{
                    background: `radial-gradient(circle at 50% 50%, rgba(5, 172, 193, 0.15), transparent 70%)`,
                }}
            />
            {children}
        </div>
    );
};

export default TiltCard;
