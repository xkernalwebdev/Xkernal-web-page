import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TiltCard from "../components/TiltCard.jsx";
import { SPONSORS } from "./landing-components/constants.js";
import LandingBackground from "./landing-components/LandingBackground.jsx";
import LandingNavbar from "./landing-components/LandingNavbar.jsx";
import LandingFooter from "./landing-components/LandingFooter.jsx";

const useSectionInView = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
};

const Sponsors = () => {
  const navigate = useNavigate();
  const [sponsorsRef, sponsorsVisible] = useSectionInView();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#020403] text-white overflow-hidden selection:bg-[#05acc1] selection:text-[#020403]">
      <LandingBackground />

      {/* --- NAVBAR --- */}
      <LandingNavbar navigate={navigate} />

      <main className="pt-20 sm:pt-24 relative z-10 pointer-events-none">
        {/* --- SPONSORS SECTION --- */}
        <section
          id="sponsors"
          ref={sponsorsRef}
          className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-32 pointer-events-auto"
        >
          <div
            className={`transition-all duration-1000 ease-out transform ${
              sponsorsVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {/* Header */}
            <div className="mb-12 sm:mb-16">
              <h2 className="text-[#05acc1] text-xs font-bold tracking-[0.3em] uppercase mb-3">
                Partners & Sponsors
              </h2>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[0.95] tracking-tighter mb-4">
                Our Growth <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#05acc1] via-white to-[#05acc1]">
                  Partners
                </span>
              </h1>
              <p className="max-w-2xl text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed mt-4">
                Supporting our vision and growth.
              </p>
            </div>

            {/* Sponsors Label */}
            <div className="mb-6 text-center">
              <p className="text-[#05acc1] text-xs font-bold tracking-[0.3em] uppercase">
                Official Music Streaming Partner
              </p>
            </div>

            {/* Sponsors Grid - Stacked */}
            <div className="grid grid-cols-1 gap-8 sm:gap-10">
              {SPONSORS.map((sponsor) => (
                <TiltCard
                  key={sponsor._id}
                  className="rounded-2xl group"
                  intensity={6}
                >
                  <div className="h-full flex flex-col rounded-2xl bg-[#080c0a] border border-white/5 hover:border-[#05acc1]/60 transition-all overflow-hidden shadow-[0_0_15px_rgba(5,172,193,0.15)] hover:shadow-[0_0_25px_rgba(5,172,193,0.25)] relative max-w-2xl mx-auto w-full">
                    {/* Glow background effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#05acc1]/2 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    {/* Logo Section */}
                    <div className="relative h-72 sm:h-96 overflow-hidden bg-gradient-to-br from-[#080c0a] to-[#050a0c] flex items-center justify-center z-10">
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        loading="lazy"
                        className="w-5/6 h-5/6 object-contain group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080c0a] via-transparent to-transparent" />
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 flex flex-col p-6 sm:p-8 gap-4 relative z-10">
                      <h3 className="text-2xl sm:text-3xl font-bold text-white group-hover:text-[#05acc1] transition-colors">
                        {sponsor.name}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-300 leading-relaxed flex-grow">
                        {sponsor.description}
                      </p>

                      {/* Category Badge */}
                      <div className="text-[10px] font-mono px-3 py-1.5 rounded-full bg-[#05acc1]/15 text-[#05acc1] uppercase tracking-widest w-fit">
                        {sponsor.category}
                      </div>

                      {/* Website Link */}
                      {sponsor.website && (
                        <a
                          href={sponsor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 w-full py-3 rounded-lg bg-[#05acc1]/10 border border-[#05acc1]/30 text-[11px] font-bold uppercase tracking-widest hover:bg-[#05acc1] hover:text-[#020403] hover:border-[#05acc1] transition-all text-center"
                        >
                          Visit Website
                        </a>
                      )}
                    </div>
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>
        </section>
      </main>

      <div className="relative pointer-events-auto">
        <LandingFooter />
      </div>

      {/* --- CSS UTILS --- */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        @keyframes textShimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .animate-text-shimmer { animation: textShimmer 3s linear infinite; }
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .will-change-transform { will-change: transform; }
      `}</style>
    </div>
  );
};

export default Sponsors;
