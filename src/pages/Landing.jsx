import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import PastEvents from "./PastEvents.jsx";
import TiltCard from "../components/TiltCard.jsx";
import { ANOKHA_EVENTS, UTR_REGEX } from "./landing-components/constants.js";
import LandingEventModal from "./landing-components/LandingEventModal.jsx";
import LandingBackground from "./landing-components/LandingBackground.jsx";
import LandingNavbar from "./landing-components/LandingNavbar.jsx";
import LandingFooter from "./landing-components/LandingFooter.jsx";
import { scrollToId } from "./landing-components/utils.js";

// --- HELPERS & HOOKS ---

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

const Landing = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedEventDetail, setSelectedEventDetail] = useState(null);

  useEffect(() => {
    api.get("/events")
      .then((res) => setEvents(res.data))
      .catch(() => { });
  }, []);

  const { techEvents, nonTechEvents } = useMemo(() => {
    const tech = [], nonTech = [];
    for (const ev of events) {
      if (ev.type === "technical") tech.push(ev);
      else nonTech.push(ev);
    }
    return { techEvents: tech, nonTechEvents: nonTech };
  }, [events]);

  const [heroRef, heroVisible] = useSectionInView();
  const [aboutRef, aboutVisible] = useSectionInView();
  const [eventsRef, eventsVisible] = useSectionInView();

  const handleRegisterClick = (eventId) => {
    window.open("https://forms.gle/4gSbdCXyuPu1LKND8", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative min-h-screen bg-[#020403] text-white overflow-hidden selection:bg-[#05acc1] selection:text-[#020403]">
      <LandingBackground />

      {/* --- NAVBAR --- */}
      <LandingNavbar navigate={navigate} />

      <main className="pt-20 sm:pt-24 relative z-10 pointer-events-none">
        {/* --- HERO SECTION --- */}
        <section
          id="hero"
          ref={heroRef}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-32 grid lg:grid-cols-2 gap-10 lg:gap-12 items-center perspective-1000 pointer-events-auto"
        >
          <div
            className={`space-y-6 sm:space-y-8 transition-all duration-1000 ease-out transform ${heroVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
              }`}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#05acc1]/10 border border-[#05acc1]/20 text-[#05acc1] text-[10px] font-mono tracking-widest uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#05acc1] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#05acc1]"></span>
              </span>
              System v2.0 Online
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tighter">
              BUILD THE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#05acc1] via-white to-[#05acc1] animate-text-shimmer bg-[length:200%_auto]">
                FUTURE
              </span>{" "}
              <br />
              CODE.
            </h1>

            <p className="max-w-md text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed">
              Join GRIET&apos;s elite technical community. Compete in
              algorithms, ship real-world projects, and dominate hackathons.
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-4">
              <button
                onClick={() => scrollToId("events")}
                className="relative px-6 sm:px-8 py-3 sm:py-4 bg-[#05acc1] text-[#020403] font-bold rounded-xl overflow-hidden group text-sm"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative flex items-center gap-2">
                  Explore Events{" "}
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </span>
              </button>
              <button
                onClick={() => scrollToId("about")}
                className="px-6 sm:px-8 py-3 sm:py-4 border border-white/10 hover:border-[#05acc1]/50 hover:bg-[#05acc1]/5 rounded-xl font-bold transition-all text-sm"
              >
                Join Community
              </button>
            </div>
          </div>

          {/* 3D Tilt Terminal Card */}
          <div
            className={`mt-8 lg:mt-0 flex justify-center transition-all duration-1000 delay-200 ${heroVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
              }`}
          >
            <TiltCard className="w-full max-w-md">
              <div className="relative bg-[#080c0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-5 sm:mb-6 border-b border-white/5 pb-3 sm:pb-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <div className="text-[10px] font-mono text-gray-500">
                    BASH // ROOT
                  </div>
                </div>
                <div className="font-mono text-[11px] sm:text-xs space-y-3">
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-[#05acc1]">
                      user@x-kernel:~$
                    </span>
                    <span className="text-white typing-effect">
                      init_club.sh
                    </span>
                  </div>
                  <div className="text-gray-500">
                    &gt; Loading assets...{" "}
                    <span className="text-[#05acc1]">Done</span>
                  </div>
                  <div className="text-gray-500">
                    &gt; Compiling modules...{" "}
                    <span className="text-[#05acc1]">Done</span>
                  </div>
                  <div className="text-gray-500">
                    &gt; Accessing GRIET mainframe...
                  </div>
                  <div className="mt-3 sm:mt-4 p-3 sm:p-4 rounded-lg bg-[#05acc1]/10 border-l-2 border-[#05acc1]">
                    <div className="text-[#05acc1] font-bold">
                      SYSTEM READY
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1">
                      Welcome to X-Kernel. The gateway to algorithmic
                      mastery.
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>
        </section>

        {/* --- ABOUT SECTION --- */}
        <section
          id="about"
          ref={aboutRef}
          className="py-20 sm:py-24 pointer-events-auto border-t border-white/5"
        >
          <div
            className={`max-w-6xl mx-auto px-4 sm:px-6 transition-all duration-1000 ${aboutVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
              }`}
          >
            <div className="mb-10 sm:mb-12">
              <h2 className="text-[#05acc1] text-xs font-bold tracking-[0.3em] uppercase mb-3">
                About Us
              </h2>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold">
                The Technical Heartbeat of GRIET.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
              {[
                {
                  title: "Problem Solving",
                  desc: "Rated contests and algorithmic drills.",
                  icon: "⚡",
                },
                {
                  title: "Development",
                  desc: "Full-stack apps, AI models, and System Design.",
                  icon: "🛠",
                },
                {
                  title: "Community",
                  desc: "300+ active peers, alumni mentors, and events.",
                  icon: "🌐",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group p-6 sm:p-8 rounded-3xl bg-[#020403] border border-white/5 hover:border-[#05acc1]/50 transition-all hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(5,172,193,0.1)]"
                >
                  <div className="text-3xl sm:text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all">
                    {item.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 text-white group-hover:text-[#05acc1] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- EVENTS SECTION (EDITED) --- */}
        <section id="events" ref={eventsRef} className="py-20 sm:py-24 pointer-events-auto">
          <div
            className={`max-w-6xl mx-auto px-4 sm:px-6 transition-all duration-1000 ${eventsVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
              }`}
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
              <div>
                <h2 className="text-[#05acc1] text-xs font-bold tracking-[0.3em] uppercase mb-3">
                  Events
                </h2>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold">
                  Upcoming Uplinks.
                </p>
              </div>
              <div className="text-[10px] sm:text-xs font-mono text-gray-500 border border-white/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full self-start">
                ./queue_status:{" "}
                <span className="text-[#05acc1]">OPEN</span>
              </div>
            </div>

            <div className="space-y-12 sm:space-y-16">
              {/* ANOKHA 2026 MEGA EVENT HERO GRID */}
              <div>
                <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#6bdbd1] to-[#05acc1]">
                      Mega Event: Anokha'26
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">
                      8 high-octane competitions. Are you ready?
                    </p>
                  </div>
                  <div className="animate-pulse bg-[#05acc1]/20 text-[#05acc1] border border-[#05acc1]/50 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(5,172,193,0.4)]">
                    Featured
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
                  {ANOKHA_EVENTS.map((ev) => (
                    <TiltCard key={ev._id} className="rounded-2xl group" intensity={6}>
                      <div className="h-full flex flex-col rounded-2xl bg-[#080c0a] border border-white/5 hover:border-[#05acc1]/60 transition-all overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                        <div className="relative h-32 sm:h-36 overflow-hidden bg-[#020403]">
                          <img src={ev.imageUrl} alt={ev.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#080c0a] to-transparent" />
                        </div>
                        <div className="flex-1 flex flex-col p-4 sm:p-5 gap-2 relative z-10">
                          <div className="text-[9px] text-[#6bdbd1] font-mono uppercase tracking-widest">{ev.type}</div>
                          <h4 className="text-sm sm:text-base font-bold group-hover:text-[#05acc1] transition-colors">{ev.title}</h4>
                          <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">{ev.description}</p>
                          <div className="text-[10px] font-bold text-[#6bdbd1] mt-1">{ev.cost}</div>
                          <div className="mt-3 flex gap-2">
                            <button type="button" onClick={() => setSelectedEventDetail(ev)} className="flex-1 py-2 rounded-lg bg-white/5 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">Know more</button>
                            <button type="button" onClick={() => handleRegisterClick(ev._id)} className="flex-1 py-2 rounded-lg bg-[#05acc1] text-[#020403] text-[10px] font-bold uppercase tracking-widest hover:shadow-[0_0_15px_rgba(5,172,193,0.6)] transition-all">Register</button>
                          </div>
                        </div>
                      </div>
                    </TiltCard>
                  ))}
                </div>
              </div>

              <div>
                {techEvents.length === 0 ? null : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
                    {techEvents.map((ev) => (
                      <TiltCard
                        key={ev._id}
                        className="rounded-2xl group"
                        intensity={5}
                      >
                        <div className="h-full flex flex-col rounded-2xl bg-[#080c0a] border border-white/5 hover:border-[#05acc1]/60 transition-all overflow-hidden">
                          {ev.imageUrl && (
                            <div className="relative h-32 sm:h-36 overflow-hidden">
                              <img
                                src={ev.imageUrl}
                                alt={ev.title}
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                            </div>
                          )}

                          <div className="flex-1 flex flex-col p-4 sm:p-5 gap-2">
                            <div className="text-[9px] text-[#05acc1] font-mono">
                              {new Date(ev.date).toDateString()}
                            </div>
                            <h4 className="text-sm sm:text-base font-bold group-hover:text-[#05acc1] transition-colors">
                              {ev.title}
                            </h4>
                            {/* short description -> expands on hover/touch */}
                            <p className="text-[11px] text-gray-400 line-clamp-2 group-hover:line-clamp-none transition-all duration-200">
                              {ev.description}
                            </p>
                            <div className="mt-3 flex gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedEventDetail(ev)}
                                className="flex-1 py-2 rounded-lg bg-white/5 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
                              >
                                Read more
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRegisterClick(ev._id)}
                                className="flex-1 py-2 rounded-lg bg-[#05acc1] text-[#020403] text-[10px] font-bold uppercase tracking-widest hover:shadow-[0_0_12px_rgba(5,172,193,0.5)] transition-all"
                              >
                                Register
                              </button>
                            </div>
                          </div>
                        </div>
                      </TiltCard>
                    ))}
                  </div>
                )}
              </div>

              <div>
                {nonTechEvents.length === 0 ? null : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
                    {nonTechEvents.map((ev) => (
                      <TiltCard
                        key={ev._id}
                        className="rounded-2xl group"
                        intensity={5}
                      >
                        <div className="h-full flex flex-col rounded-2xl bg-[#080c0a] border border-white/5 hover:border-[#6bdbd1]/60 transition-all overflow-hidden">
                          {ev.imageUrl && (
                            <div className="relative h-32 sm:h-36 overflow-hidden">
                              <img
                                src={ev.imageUrl}
                                alt={ev.title}
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                            </div>
                          )}

                          <div className="flex-1 flex flex-col p-4 sm:p-5 gap-2">
                            <div className="text-[9px] text-[#6bdbd1] font-mono">
                              {new Date(ev.date).toDateString()}
                            </div>
                            <h4 className="text-sm sm:text-base font-bold group-hover:text-[#6bdbd1] transition-colors">
                              {ev.title}
                            </h4>
                            <p className="text-[11px] text-gray-400 line-clamp-2 group-hover:line-clamp-none transition-all duration-200">
                              {ev.description}
                            </p>
                            <div className="mt-3 flex gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedEventDetail(ev)}
                                className="flex-1 py-2 rounded-lg bg-white/5 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
                              >
                                Read more
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRegisterClick(ev._id)}
                                className="flex-1 py-2 rounded-lg bg-[#6bdbd1] text-[#020403] text-[10px] font-bold uppercase tracking-widest hover:shadow-[0_0_12px_rgba(107,219,209,0.5)] transition-all"
                              >
                                Register
                              </button>
                            </div>
                          </div>
                        </div>
                      </TiltCard>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="relative pointer-events-auto"><PastEvents /></div>
      </main>

      <LandingFooter />

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

      {selectedEventDetail && (
        <LandingEventModal event={selectedEventDetail} onClose={() => setSelectedEventDetail(null)} />
      )}
    </div>
  );
};

export default Landing;