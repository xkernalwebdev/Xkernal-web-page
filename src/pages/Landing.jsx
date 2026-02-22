import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import PastEvents from "./PastEvents.jsx";

// --- HELPERS & HOOKS ---

const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const UTR_REGEX = /^[0-9]{12,16}$/;

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

const ANOKHA_EVENTS = [
  {
    _id: "anokha-code-pong",
    title: "Code Pong",
    description: "Team-based pong game mixed with coding challenges. Landing the ball in a coding cup forces the opponent to solve a problem. Success earns bonus shots; failure removes the cup.",
    type: "Tech + Fun",
    cost: "₹200 per team (2 players)",
    imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800"
  },
  {
    _id: "anokha-tech-doctor",
    title: "Tech Doctor",
    description: "Team-based tech game where participants save a virtual human body. Each team solves technical or logical questions to crack a code and cure an assigned organ.",
    type: "Tech",
    cost: "₹250 per team (3 players)",
    imageUrl: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800"
  },
  {
    _id: "anokha-codeblast",
    title: "CodeBlast",
    description: "High-pressure coding challenge inspired by bomb-defusal logic. Teams solve codes to safely cut 5 wires. Wrong cuts cost lives. Lose all 3 lives and you're out.",
    type: "Tech",
    cost: "₹200 per team (2-3 players)",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800"
  },
  {
    _id: "anokha-quiz-dodge",
    title: "Quiz Dodge",
    description: "Two teams answer tech questions. The team that answers first gets the dodgeball and can eliminate opponents. After 5 questions, the team with more players advances.",
    type: "Tech + Fun",
    cost: "₹150 per team (4-5 players)",
    imageUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=800"
  },
  {
    _id: "anokha-ideathon",
    title: "Ideathon (Spark Tank)",
    description: "Innovation event where teams brainstorm solutions to real-world problems and pitch their ideas to judges. Encourages creativity and collaboration.",
    type: "Tech",
    cost: "₹250 per team (2-4 players)",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800"
  },
  {
    _id: "anokha-escape-room",
    title: "Escape Room",
    description: "Puzzle-based team challenge where participants solve clues and escape within a fixed time limit.",
    type: "Non-Tech",
    cost: "₹150 per person",
    imageUrl: "https://res.cloudinary.com/dynpwzjch/image/upload/v1771737565/ChatGPT_Image_Feb_22_2026_10_14_08_AM_fld3v5.png"
  },
  {
    _id: "anokha-box-cricket",
    title: "Box Cricket",
    description: "Fast-paced short-format cricket played in a compact area with small teams and quick matches.",
    type: "Non-Tech (Sports)",
    cost: "₹300 per team (5 players)",
    imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800"
  },
  {
    _id: "anokha-movie-marathon",
    title: "Movie Marathon",
    description: "Relaxed group movie screening focused on entertainment and bonding.",
    type: "Non-Tech",
    cost: "₹100 per person",
    imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800"
  }
];

const LandingEventModal = ({ event, onClose }) => {
  if (!event) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md" onClick={onClose}>
      <div className="bg-[#080c0a] border border-[#05acc1]/30 rounded-2xl p-6 sm:p-8 max-w-lg w-full relative z-10 shadow-[0_0_40px_rgba(5,172,193,0.15)]" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-white mb-2">{event.title}</h2>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[10px] sm:text-xs font-mono px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 uppercase tracking-widest">{event.type}</span>
          {event.cost && <span className="text-[10px] sm:text-xs font-mono px-2 py-0.5 rounded-full bg-[#6bdbd1]/15 text-[#6bdbd1] uppercase tracking-widest">{event.cost}</span>}
        </div>
        <p className="text-sm text-gray-300 leading-relaxed mb-6">{event.description}</p>
        <button onClick={onClose} className="w-full py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-[#05acc1] hover:text-[#020403] text-xs font-bold uppercase tracking-[0.18em] transition-all text-gray-300">Close</button>
      </div>
    </div>
  );
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
      {/* --- ANIMATED BACKGROUND --- */}
      {/* Optimization: Added transform-gpu and will-change-transform */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#05acc1] rounded-full mix-blend-screen blur-[120px] opacity-10 animate-blob transform-gpu will-change-transform" />
        <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[#6bdbd1] rounded-full mix-blend-screen blur-[120px] opacity-10 animate-blob animation-delay-2000 transform-gpu will-change-transform" />
        <div className="absolute bottom-[-20%] left-[20%] w-[40vw] h-[40vw] bg-[#09969f] rounded-full mix-blend-screen blur-[120px] opacity-10 animate-blob animation-delay-4000 transform-gpu will-change-transform" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      </div>

      {/* --- NAVBAR --- */}
      <header className="fixed inset-x-0 top-0 z-50 transition-all duration-300">
        <div className="absolute inset-0 bg-[#020403]/70 backdrop-blur-md border-b border-white/5" />
        <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
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
            {["Home", "About Me", "Events"].map((id) => (
              <button
                key={id}
                onClick={() => {
                  if (id === "Home") scrollToId("hero");
                  else if (id === "About Me") scrollToId("about");
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

      <main className="pt-20 sm:pt-24">
        {/* --- HERO SECTION --- */}
        <section
          id="hero"
          ref={heroRef}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-32 grid lg:grid-cols-2 gap-10 lg:gap-12 items-center perspective-1000"
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
          className="py-20 sm:py-24 border-t border-white/5 bg-white/[0.02]"
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
        <section id="events" ref={eventsRef} className="py-20 sm:py-24">
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
                <div className="mb-6 flex items-center justify-between border-b border-purple-500/20 pb-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#05acc1]">
                      Mega Event: Anokha'26
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">
                      8 high-octane competitions. Are you ready?
                    </p>
                  </div>
                  <div className="animate-pulse bg-purple-500/20 text-purple-400 border border-purple-500/50 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                    Featured
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
                  {ANOKHA_EVENTS.map((ev) => (
                    <TiltCard key={ev._id} className="rounded-2xl group" intensity={6}>
                      <div className="h-full flex flex-col rounded-2xl bg-[#080c0a] border border-purple-500/20 hover:border-purple-400/60 transition-all overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                        <div className="relative h-32 sm:h-36 overflow-hidden bg-[#020403]">
                          <img src={ev.imageUrl} alt={ev.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#080c0a] to-transparent" />
                        </div>
                        <div className="flex-1 flex flex-col p-4 sm:p-5 gap-2 relative z-10">
                          <div className="text-[9px] text-purple-400 font-mono uppercase tracking-widest">{ev.type}</div>
                          <h4 className="text-sm sm:text-base font-bold group-hover:text-purple-300 transition-colors">{ev.title}</h4>
                          <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">{ev.description}</p>
                          <div className="text-[10px] font-bold text-[#6bdbd1] mt-1">{ev.cost}</div>
                          <div className="mt-3 flex gap-2">
                            <button type="button" onClick={() => setSelectedEventDetail(ev)} className="flex-1 py-2 rounded-lg bg-white/5 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">Know more</button>
                            <button type="button" onClick={() => handleRegisterClick(ev._id)} className="flex-1 py-2 rounded-lg bg-purple-500 text-white text-[10px] font-bold uppercase tracking-widest hover:shadow-[0_0_15px_rgba(168,85,247,0.6)] transition-all">Register</button>
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

        <PastEvents />
      </main>

      <footer className="py-8 sm:py-10 border-t border-white/5 text-center flex flex-col items-center gap-4">
        <a href="https://www.instagram.com/xkernel_griet/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#05acc1] transition-colors text-sm sm:text-base font-mono flex items-center gap-2 font-bold tracking-wide">
          <span>Follow for more updates</span>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
          </svg>
        </a>
        <div className="text-[9px] sm:text-[10px] text-gray-600 font-mono uppercase tracking-widest">
          &copy; 2026 X-Kernel Club. All systems operational.
        </div>
      </footer>

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