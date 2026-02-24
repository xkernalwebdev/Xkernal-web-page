import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

// ---------- helpers ----------

const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

const useSectionInView = () => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        setVisible(true);
                        obs.unobserve(e.target);
                    }
                });
            },
            { threshold: 0.1 }
        );
        obs.observe(node);
        return () => obs.disconnect();
    }, []);
    return [ref, visible];
};

// Optimised 3D tilt (direct DOM, no state re-render)
const TiltCard = ({ children, className = "", intensity = 8 }) => {
    const cardRef = useRef(null);
    const glowRef = useRef(null);
    const rafRef = useRef(null);

    const handleMouseMove = (e) => {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
            if (!cardRef.current) return;
            const { left, top, width, height } =
                cardRef.current.getBoundingClientRect();
            const x = e.clientX - left;
            const y = e.clientY - top;
            const rX = ((y - height / 2) / height) * -intensity;
            const rY = ((x - width / 2) / width) * intensity;
            cardRef.current.style.transform = `perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg)`;
            if (glowRef.current) {
                glowRef.current.style.background = `radial-gradient(circle at ${(x / width) * 100}% ${(y / height) * 100
                    }%, rgba(5,172,193,0.15), transparent 70%)`;
            }
        });
    };

    const handleMouseLeave = () => {
        if (cardRef.current)
            cardRef.current.style.transform =
                "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`relative transition-transform duration-200 ease-out group ${className}`}
            style={{ transformStyle: "preserve-3d", willChange: "transform" }}
        >
            <div
                ref={glowRef}
                className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[inherit]"
                style={{
                    background:
                        "radial-gradient(circle at 50% 50%, rgba(5,172,193,0.15), transparent 70%)",
                }}
            />
            {children}
        </div>
    );
};

// ─────────── FILTER TABS ───────────
const FILTERS = ["All", "Technical", "Non-Technical"];

// ─────────── TYPE BADGE ───────────
const TypeBadge = ({ type }) =>
    type === "technical" ? (
        <span className="inline-block px-2 py-0.5 rounded-full bg-[#05acc1]/15 text-[#05acc1] text-[9px] font-bold uppercase tracking-[0.16em]">
            Technical
        </span>
    ) : type === "both" ? (
        <div className="flex gap-2 flex-wrap">
            <span className="inline-block px-2 py-0.5 rounded-full bg-[#05acc1]/15 text-[#05acc1] text-[9px] font-bold uppercase tracking-[0.16em]">
                Technical
            </span>
            <span className="inline-block px-2 py-0.5 rounded-full bg-[#6bdbd1]/15 text-[#6bdbd1] text-[9px] font-bold uppercase tracking-[0.16em]">
                Non-Technical
            </span>
        </div>
    ) : (
        <span className="inline-block px-2 py-0.5 rounded-full bg-[#6bdbd1]/15 text-[#6bdbd1] text-[9px] font-bold uppercase tracking-[0.16em]">
            Non-Technical
        </span>
    );

// ─────────── CARD CAROUSEL ───────────
const CardCarousel = ({ images, title, isActive = true, onFinish }) => {
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        if (!isActive) {
            setIdx(0);
            return;
        }
        if (!images || images.length <= 1) {
            const timer = setTimeout(() => {
                if (onFinish) onFinish();
            }, 5000);
            return () => clearTimeout(timer);
        }
        const timer = setInterval(() => {
            setIdx(prev => {
                const next = prev + 1;
                if (next >= images.length) {
                    if (onFinish) onFinish();
                    return 0;
                }
                return next;
            });
        }, 3000);
        return () => clearInterval(timer);
    }, [images, isActive, onFinish]);

    if (!images || images.length === 0) return null;
    return (
        <React.Fragment>
            {images.map((img, i) => (
                <img
                    key={i}
                    src={img}
                    alt={title}
                    loading="lazy"
                    className={`absolute inset-0 w-full h-full object-contain transition-all duration-1000 ease-in-out saturate-[0.7] ${isActive ? 'group-hover:scale-[1.06] group-hover:saturate-100' : ''} ${i === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 scale-[1.02]'}`}
                />
            ))}
        </React.Fragment>
    );
};

// ─────────── SINGLE EVENT DISPLAY ───────────
const SingleEventDisplay = ({ events, onSelectEvent }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        setCurrentIndex(0);
    }, [events.length]);

    const handleFinish = React.useCallback(() => {
        setCurrentIndex(prev => (prev + 1) % events.length);
    }, [events.length]);

    if (!events || events.length === 0) return null;

    // Navigation functions
    const nextCard = () => setCurrentIndex(prev => (prev + 1) % events.length);
    const prevCard = () => setCurrentIndex(prev => (prev - 1 + events.length) % events.length);

    return (
        <div className="relative w-full flex flex-col items-center justify-center mb-8 min-h-[600px] sm:min-h-[700px] overflow-hidden">
            {/* Gallery Track */}
            <div className="relative w-full h-[580px] sm:h-[680px] lg:h-[750px] flex items-center justify-center">
                {events.map((ev, i) => {
                    let diff = i - currentIndex;
                    const total = events.length;
                    if (diff > total / 2) diff -= total;
                    if (diff < -total / 2) diff += total;

                    const isCenter = diff === 0;
                    const distance = Math.abs(diff);

                    const opacity = distance > 1 ? 0 : (isCenter ? 1 : 0.4);
                    const scale = isCenter ? 1 : 0.85;
                    const zIndex = 50 - distance;

                    return (
                        <div
                            key={ev._id}
                            className={`absolute top-1/2 left-1/2 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl ${isCenter ? 'cursor-auto' : 'cursor-pointer hover:opacity-75'}`}
                            style={{
                                transform: `translate(-50%, -50%) translateX(calc(${diff} * clamp(260px, 45vw, 500px))) scale(${scale})`,
                                opacity: opacity,
                                zIndex: zIndex,
                                pointerEvents: distance > 1 ? 'none' : 'auto'
                            }}
                            onClick={() => {
                                if (!isCenter) setCurrentIndex(i);
                            }}
                        >
                            <TiltCard intensity={isCenter ? 6 : 0} className="w-full rounded-2xl group cursor-pointer" >
                                <div onClick={() => { if (isCenter) onSelectEvent(ev); }} className={`flex flex-col rounded-3xl bg-[#080c0a] border transition-all overflow-hidden w-full h-auto select-none shadow-[0_20px_60px_rgba(0,0,0,0.6)]
                                    ${(ev.type === "technical" || ev.type === "both") ? "border-white/10 hover:border-[#05acc1]/60" : "border-white/10 hover:border-[#6bdbd1]/60"}
                                `}>
                                    <div className="relative h-[280px] sm:h-[320px] lg:h-[360px] overflow-hidden bg-[#050709] shrink-0">
                                        <CardCarousel
                                            images={ev.images || [ev.imageUrl]}
                                            title={ev.title}
                                            isActive={isCenter}
                                            onFinish={handleFinish}
                                        />
                                        <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#080c0a] via-black/10 to-transparent pointer-events-none" />
                                    </div>
                                    <div className="flex-1 flex flex-col p-5 sm:p-6 lg:p-8 gap-4 relative z-30 bg-[#080c0a]">
                                        <div className="flex items-center justify-between gap-2 flex-wrap">
                                            <span className={`text-[10px] sm:text-xs font-mono ${(ev.type === "technical" || ev.type === "both") ? "text-[#05acc1]" : "text-[#6bdbd1]"}`}>
                                                {formatDate(ev.date)}
                                            </span>
                                            <TypeBadge type={ev.type} />
                                        </div>
                                        <h3 className={`text-base sm:text-lg lg:text-xl font-bold leading-snug transition-colors ${(ev.type === "technical" || ev.type === "both") ? "group-hover:text-[#05acc1]" : "group-hover:text-[#6bdbd1]"}`}>
                                            {ev.title}
                                        </h3>
                                        {ev.description && (
                                            <p className="text-xs lg:text-sm text-gray-400 line-clamp-3 leading-relaxed">
                                                {ev.description}
                                            </p>
                                        )}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (isCenter) onSelectEvent(ev);
                                                else setCurrentIndex(i);
                                            }}
                                            className={`mt-2 w-full py-3 rounded-xl text-[11px] lg:text-xs font-bold uppercase tracking-widest transition-all
                                                ${(ev.type === "technical" || ev.type === "both") ? "bg-[#05acc1]/10 text-[#05acc1] hover:bg-[#05acc1] hover:text-[#020403] hover:shadow-[0_0_12px_rgba(5,172,193,0.4)]" : "bg-[#6bdbd1]/10 text-[#6bdbd1] hover:bg-[#6bdbd1] hover:text-[#020403] hover:shadow-[0_0_12px_rgba(107,219,209,0.4)]"}
                                            `}
                                        >
                                            {isCenter ? "Read More →" : "Bring to Center"}
                                        </button>
                                    </div>
                                </div>
                            </TiltCard>
                        </div>
                    );
                })}
            </div>

            {/* Navigation Controls underneath */}
            <div className="mt-8 flex items-center justify-center gap-6 pointer-events-auto">
                <button onClick={prevCard} className="w-12 h-12 rounded-full flex items-center justify-center bg-[#050709] border border-white/10 hover:bg-[#05acc1] hover:text-[#020403] hover:border-transparent transition-all hover:scale-110 shadow-[0_0_15px_rgba(0,0,0,0.5)] z-[60]">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                </button>
                <div className="flex gap-2 z-[60]">
                    {events.map((_, i) => (
                        <button key={i} onClick={() => setCurrentIndex(i)} className={`h-1.5 rounded-full transition-all ${i === currentIndex ? 'w-8 bg-[#05acc1] shadow-[0_0_10px_rgba(5,172,193,0.6)]' : 'w-2 bg-gray-600 hover:bg-gray-400'}`} />
                    ))}
                </div>
                <button onClick={nextCard} className="w-12 h-12 rounded-full flex items-center justify-center bg-[#050709] border border-white/10 hover:bg-[#05acc1] hover:text-[#020403] hover:border-transparent transition-all hover:scale-110 shadow-[0_0_15px_rgba(0,0,0,0.5)] z-[60]">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                </button>
            </div>
        </div>
    );
};

// ─────────── MODAL ───────────
const EventModal = ({ event, onClose }) => {
    useEffect(() => {
        const handler = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    if (!event) return null;
    return (
        <div
            className="fixed inset-0 z-[999] flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

            {/* Sheet */}
            <div
                className="relative z-10 w-full max-w-lg bg-[#080c0a]/95 border border-white/10 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.8)] animate-modal-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Cyan accent line */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#05acc1] to-transparent opacity-70" />

                {/* Image */}
                {event.images?.length > 0 || event.imageUrl ? (
                    <div className="relative h-[300px] sm:h-[360px] overflow-hidden group shrink-0 bg-[#050709]">
                        <CardCarousel images={event.images || [event.imageUrl]} title={event.title} />
                        <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#080c0a] via-black/30 to-transparent pointer-events-none" />
                    </div>
                ) : null}

                <div className="p-6 sm:p-8 space-y-5">
                    {/* Meta */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <TypeBadge type={event.type} />
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                            {formatDate(event.date)}
                        </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                        {event.title}
                    </h2>

                    {/* Description */}
                    {event.description && (
                        <p className="text-sm text-gray-400 leading-relaxed">
                            {event.description}
                        </p>
                    )}

                    {/* Entry fee */}
                    {event.entryFee !== undefined && event.entryFee !== null && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300">
                            <span className="text-[#05acc1] font-mono">₹</span>
                            Entry Fee:{" "}
                            <span className="font-bold text-white">
                                {event.entryFee === 0 ? "Free" : `₹${event.entryFee}`}
                            </span>
                        </div>
                    )}

                    {/* Close */}
                    <button
                        onClick={onClose}
                        className="w-full py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-[0.18em] transition-all text-gray-300"
                    >
                        Close
                    </button>
                </div>
            </div>

            <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.94) translateY(12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
        .animate-modal-in { animation: modalIn 250ms cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>
        </div>
    );
};

// ─────────── FEATURED EVENT META ───────────
const FEATURED_EVENT = {
    title: "Agentic AI Lecture",
    description: "The Seminar on Agentic AI, organized by X-Kernel in collaboration with the Department of CSE at GRIET on 10th October 2025, provided deep insights into how intelligent agents are transforming industries. Led by Mr. Satish Kumar AV, the session explored core concepts such as Retrieval-Augmented Generation (RAG), tokenization, and prompt engineering. Students gained clarity on how Agentic AI systems combine reasoning, automation, and real-time data retrieval to solve complex real-world problems. The seminar emphasized practical applications and encouraged participants to explore innovation in AI-driven systems.",
    images: [
        "https://res.cloudinary.com/dynpwzjch/image/upload/v1771679849/P34A2497_hbf9bo.jpg",
        "https://res.cloudinary.com/dynpwzjch/image/upload/v1771679849/P34A2542_ntng5w.jpg",
        "https://res.cloudinary.com/dynpwzjch/image/upload/v1771679843/IMG_4223_j4txdh.jpg",
        "https://res.cloudinary.com/dynpwzjch/image/upload/v1771679843/IMG_4219_fqcirf.jpg"
    ]
};

const WEBINAR_EVENT = {
    title: "Project-Based Learning Webinar",
    description: "The Webinar on Project-Based Learning, conducted on 30th April 2025, highlighted how real-world projects enhance technical competence and global career readiness. Speakers Dr. Vikas Vittal Shinde and Mr. Sandip explained how Project-Based Learning (PBL) strengthens critical thinking, hands-on problem-solving, and interdisciplinary collaboration. The session also demonstrated how structured project work can create pathways to international internships and research opportunities. Students were guided on aligning academic learning with industry expectations through practical implementation.",
    images: [
        "https://res.cloudinary.com/dynpwzjch/image/upload/v1771691237/webinar1_hxeiz4.png",
        "https://res.cloudinary.com/dynpwzjch/image/upload/v1771691294/webinar2_vh4qun.png"
    ]
};

const CPL_EVENT = {
    title: "CPL (Coding Premier League)",
    description: "CPL (Coding Premier League) was a competitive, team-based coding tournament structured in a knockout format. Participants advanced through group rounds, semifinals, and a high-intensity final where speed and accuracy determined the champions. The competition tested algorithmic thinking, logical reasoning, and time management under pressure. Designed to simulate real competitive programming environments, CPL encouraged teamwork, strategic planning, and analytical problem-solving, rewarding the winners with cash prizes and certificates.",
    images: [
        "https://res.cloudinary.com/dynpwzjch/image/upload/v1771691290/cpl1_kwsprg.jpg",
        "https://res.cloudinary.com/dynpwzjch/image/upload/v1771691236/clp3_i3lfuq.jpg",
        "https://res.cloudinary.com/dynpwzjch/image/upload/v1771691236/cpl4_cjoa0h.jpg"
    ]
};

const MEGA_EVENT = {
    title: "Mega Event 2024",
    description: "The Mega Event was a dynamic celebration of both technical and non-technical excellence, bringing together a variety of competitions under one platform. Participants engaged in coding challenges, technical showcases, creative contests, quizzes, and interactive activities that promoted innovation and collaboration. The event fostered teamwork, leadership, and creativity while providing students an opportunity to explore diverse talents beyond academics. It served as an inclusive platform to showcase skills, compete enthusiastically, and celebrate student achievement.",
    images: [
        "https://res.cloudinary.com/dynpwzjch/image/upload/v1771692236/WhatsApp_Image_2026-02-21_at_7.52.00_PM_cerhdd.jpg"
    ]
};

// ─────────────────────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
const PastEvents = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedEvent, setSelectedEvent] = useState(null);

    const [heroRef, heroVisible] = useSectionInView();
    const [gridRef, gridVisible] = useSectionInView();

    useEffect(() => {
        api
            .get("/events")
            .then((res) => {
                const now = new Date();
                // Past events: date is before today
                const past = (res.data || []).filter(
                    (ev) => new Date(ev.date) < now
                );

                // Inject Static Events
                const staticEvents = [
                    {
                        _id: "agentic-ai-lecture-featured",
                        title: FEATURED_EVENT.title,
                        description: FEATURED_EVENT.description,
                        imageUrl: FEATURED_EVENT.images[0],
                        images: FEATURED_EVENT.images,
                        type: "technical",
                        date: new Date("2026-02-15T00:00:00Z").toISOString()
                    },
                    {
                        _id: "webinar-project-learning",
                        title: WEBINAR_EVENT.title,
                        description: WEBINAR_EVENT.description,
                        imageUrl: WEBINAR_EVENT.images[0],
                        images: WEBINAR_EVENT.images,
                        type: "technical",
                        date: new Date("2025-04-30T00:00:00Z").toISOString()
                    },
                    {
                        _id: "cpl-coding-premier-league",
                        title: CPL_EVENT.title,
                        description: CPL_EVENT.description,
                        imageUrl: CPL_EVENT.images[0],
                        images: CPL_EVENT.images,
                        type: "technical",
                        date: new Date("2025-03-15T00:00:00Z").toISOString() // Default date for CPL
                    },
                    {
                        _id: "mega-event-2024",
                        title: MEGA_EVENT.title,
                        description: MEGA_EVENT.description,
                        imageUrl: MEGA_EVENT.images[0],
                        images: MEGA_EVENT.images,
                        type: "both",
                        date: new Date("2024-12-06T00:00:00Z").toISOString() // 6th Dec 2024
                    }
                ];

                past.push(...staticEvents);

                // Sort newest first
                past.sort((a, b) => new Date(b.date) - new Date(a.date));
                setEvents(past);
            })
            .catch(() => {
                setEvents([
                    {
                        _id: "agentic-ai-lecture-featured",
                        title: FEATURED_EVENT.title,
                        description: FEATURED_EVENT.description,
                        imageUrl: FEATURED_EVENT.images[0],
                        images: FEATURED_EVENT.images,
                        type: "technical",
                        date: new Date("2026-02-15T00:00:00Z").toISOString()
                    },
                    {
                        _id: "webinar-project-learning",
                        title: WEBINAR_EVENT.title,
                        description: WEBINAR_EVENT.description,
                        imageUrl: WEBINAR_EVENT.images[0],
                        images: WEBINAR_EVENT.images,
                        type: "technical",
                        date: new Date("2025-04-30T00:00:00Z").toISOString()
                    },
                    {
                        _id: "cpl-coding-premier-league",
                        title: CPL_EVENT.title,
                        description: CPL_EVENT.description,
                        imageUrl: CPL_EVENT.images[0],
                        images: CPL_EVENT.images,
                        type: "technical",
                        date: new Date("2025-03-15T00:00:00Z").toISOString()
                    },
                    {
                        _id: "mega-event-2024",
                        title: MEGA_EVENT.title,
                        description: MEGA_EVENT.description,
                        imageUrl: MEGA_EVENT.images[0],
                        images: MEGA_EVENT.images,
                        type: "both",
                        date: new Date("2024-12-06T00:00:00Z").toISOString()
                    }
                ]);
            })
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        let list = events;
        if (search.trim())
            list = list.filter((e) =>
                e.title.toLowerCase().includes(search.toLowerCase())
            );
        return list;
    }, [events, search]);

    const stats = useMemo(
        () => ({
            total: events.length,
        }),
        [events]
    );

    return (
        <div id="past-events" className="relative text-white selection:bg-[#05acc1] selection:text-[#020403]">
            {/* ── DIVIDER ── */}
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#05acc1]/40 to-transparent" />

            {/* ── HERO ── */}
            <section
                ref={heroRef}
                className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 lg:pt-24 pb-4 sm:pb-6"
            >
                <div
                    className={`transition-all duration-1000 ease-out ${heroVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-10"
                        }`}
                >
                    {/* Eye-brow */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#05acc1]/10 border border-[#05acc1]/20 text-[#05acc1] text-[10px] font-mono tracking-widest uppercase mb-6">
                        Archive // X-Kernel Events
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[0.95] tracking-tighter mb-6">
                        PAST{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#05acc1] via-white to-[#05acc1] animate-text-shimmer bg-[length:200%_auto]">
                            EVENTS
                        </span>
                    </h1>

                    <p className="max-w-xl text-gray-400 text-sm sm:text-base leading-relaxed mb-10">
                        A record of every hackathon, contest, and workshop X‑Kernel has
                        run. Browse the archives and see what you missed — or relive the
                        moments.
                    </p>

                    {/* Stat pills */}
                    {!loading && (
                        <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#050709]/80 border border-white/10 backdrop-blur-xl">
                                <span className="text-2xl font-black text-white">
                                    {stats.total}
                                </span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-[0.16em] font-mono">
                                    Total Events
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </section>


            {/* ── FILTER + SEARCH + GRID ── */}
            <section
                ref={gridRef}
                className="max-w-7xl mx-auto px-4 sm:px-6 pt-2 pb-16 sm:pb-20"
            >
                <div
                    className={`transition-all duration-1000 ${gridVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-10"
                        }`}
                >
                    {/* Controls row */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10">
                        {/* Search */}
                        <div className="relative flex-1 sm:max-w-xs">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-xs font-mono pointer-events-none">
                                /
                            </span>
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search events..."
                                className="w-full pl-7 pr-4 py-2 rounded-xl bg-[#050709]/80 border border-white/10 text-sm text-gray-200 placeholder:text-gray-700 focus:outline-none focus:border-[#05acc1]/60 focus:ring-1 focus:ring-[#05acc1]/40 transition-all backdrop-blur-xl"
                            />
                        </div>

                        {/* Result count */}
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest px-3 py-1.5 border border-white/10 rounded-full bg-[#050709]/60 self-start sm:self-auto whitespace-nowrap">
                            {filtered.length} node{filtered.length !== 1 ? "s" : ""}
                        </span>
                    </div>

                    {/* ── LOADING ── */}
                    {loading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-64 rounded-2xl bg-[#050709]/80 border border-white/5 animate-pulse"
                                />
                            ))}
                        </div>
                    )}

                    {/* ── EMPTY ── */}
                    {!loading && filtered.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <div className="text-5xl opacity-30">📭</div>
                            <p className="text-sm text-gray-500">
                                {search
                                    ? `No events matching "${search}"`
                                    : "No past events found."}
                            </p>
                            {search && (
                                <button
                                    onClick={() => setSearch("")}
                                    className="text-[11px] text-[#05acc1] hover:underline font-mono"
                                >
                                    Clear search →
                                </button>
                            )}
                        </div>
                    )}

                    {/* ── GRID ── */}
                    {!loading && filtered.length > 0 && (
                        <SingleEventDisplay events={filtered} onSelectEvent={setSelectedEvent} />
                    )}
                </div>
            </section>

            {/* ── EVENT DETAIL MODAL ── */}
            {selectedEvent && (
                <EventModal
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                />
            )}

            {/* ── CSS UTILS ── */}
            <style>{`
        @keyframes blob {
          0%   { transform: translate(0px, 0px) scale(1); }
          33%  { transform: translate(30px, -50px) scale(1.1); }
          66%  { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }

        @keyframes textShimmer {
          0%   { background-position: 0%   50%; }
          100% { background-position: 100% 50%; }
        }
        .animate-text-shimmer { animation: textShimmer 3s linear infinite; }

        @keyframes fadeScale {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
        .animate-fade-scale { animation: fadeScale 400ms cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>
        </div>
    );
};

export default PastEvents;
