import React from "react";

const LandingEventModal = ({ event, onClose }) => {
    if (!event) return null;
    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md" onClick={onClose}>
            <div className="bg-[#080c0a] border border-[#05acc1]/30 rounded-2xl p-6 sm:p-8 max-w-lg w-full relative z-10 shadow-[0_0_40px_rgba(5,172,193,0.15)]" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-white mb-2">{event.title}</h2>
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] sm:text-xs font-mono px-2 py-0.5 rounded-full bg-[#05acc1]/15 text-[#05acc1] uppercase tracking-widest">{event.type}</span>
                    {event.cost && <span className="text-[10px] sm:text-xs font-mono px-2 py-0.5 rounded-full bg-[#6bdbd1]/15 text-[#6bdbd1] uppercase tracking-widest">{event.cost}</span>}
                </div>
                <p className="text-sm text-gray-300 leading-relaxed mb-6">{event.description}</p>
                <button onClick={onClose} className="w-full py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-[#05acc1] hover:text-[#020403] text-xs font-bold uppercase tracking-[0.18em] transition-all text-gray-300">Close</button>
            </div>
        </div>
    );
};

export default LandingEventModal;
