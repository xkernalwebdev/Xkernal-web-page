// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import { downloadCSV } from "../utils/csv.js";
import { useAuth } from "../context/AuthContext.jsx";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    members: 0,
    events: 0,
    registrations: 0,
  });
  const [recentEvents, setRecentEvents] = useState([]);

  const canExport = user && (user.role === "admin" || user.role === "lead");

  useEffect(() => {
    const load = async () => {
      try {
        const [usersRes, eventsRes] = await Promise.all([
          api.get("/users/public"),
          api.get("/events"),
        ]);

        const events = eventsRes.data || [];
        let totalRegs = 0;

        if (user && (user.role === "admin" || user.role === "lead")) {
          const regCounts = await Promise.all(
            events.map(async (ev) => {
              try {
                const res = await api.get(`/registrations/event/${ev._id}`);
                return Array.isArray(res.data) ? res.data.length : 0;
              } catch {
                return 0;
              }
            })
          );
          totalRegs = regCounts.reduce((sum, n) => sum + n, 0);
        }

        setStats({
          members: usersRes.data.length,
          events: events.length,
          registrations: totalRegs,
        });

        setRecentEvents(
          events
            .slice()
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 5)
        );
      } catch {
        // ignore
      }
    };
    load();
  }, [user]);

  const exportMembers = async () => {
    try {
      const res = await api.get("/users/public");
      const rows = res.data.map((u) => ({
        Name: u.name,
        Email: u.email,
        Role: u.role,
        Domain: u.domain || "",
        Year: u.year || "",
        ImageUrl: u.imageUrl || "",
      }));
      if (!rows.length) return;
      downloadCSV(rows, "xkernel_members.csv");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Control Panel
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Quick view of members, events and registrations.
          </p>
        </div>
        {user && (
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#050709] px-3 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-gray-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#05acc1] opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#05acc1]" />
            </span>
            {user.role} mode
          </span>
        )}
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Members */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#050709]/80 backdrop-blur-xl p-4 sm:p-5 shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
          <div className="pointer-events-none absolute -top-10 -right-10 h-24 w-24 rounded-full bg-[#05acc1]/10 blur-3xl" />
          <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500 mb-1">
            Active Members
          </p>
          <p className="text-3xl sm:text-4xl font-black text-white">
            {stats.members}
          </p>
          <p className="mt-1 text-[11px] text-gray-500">
            Current users synced from club records.
          </p>
        </div>

        {/* Events */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#050709]/80 backdrop-blur-xl p-4 sm:p-5 shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
          <div className="pointer-events-none absolute -top-10 -right-10 h-24 w-24 rounded-full bg-[#6bdbd1]/10 blur-3xl" />
          <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500 mb-1">
            Total Events
          </p>
          <p className="text-3xl sm:text-4xl font-black text-white">
            {stats.events}
          </p>
          <p className="mt-1 text-[11px] text-gray-500">
            All technical and non‑technical events.
          </p>
        </div>

        {/* Registrations */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#050709]/80 backdrop-blur-xl p-4 sm:p-5 shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
          <div className="pointer-events-none absolute -top-10 -right-10 h-24 w-24 rounded-full bg-[#09969f]/10 blur-3xl" />
          <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500 mb-1">
            Registrations
          </p>
          <p className="text-3xl sm:text-4xl font-black text-white">
            {stats.registrations}
          </p>
          <p className="mt-1 text-[11px] text-gray-500">
            Counted from per‑event registration lists.
          </p>
        </div>
      </div>

      {/* Export (members only, admin & lead) */}
      {canExport && (
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#050709]/80 backdrop-blur-xl p-4 sm:p-5 shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
          <div className="pointer-events-none absolute -top-16 right-0 h-24 w-24 rounded-full bg-[#05acc1]/10 blur-3xl" />
          <p className="text-sm font-semibold mb-3 flex items-center gap-2">
            Data Exports
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#05acc1]">
              ./backup.sh
            </span>
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <button
              onClick={exportMembers}
              className="relative overflow-hidden px-4 py-2 rounded-xl bg-[#05acc1] text-[#020403] font-semibold text-xs uppercase tracking-[0.16em] hover:shadow-[0_0_18px_rgba(5,172,193,0.5)] transition-all hover:-translate-y-0.5"
            >
              <span className="absolute inset-0 bg-white/15 translate-y-full hover:translate-y-0 transition-transform duration-300" />
              <span className="relative">Export Members CSV</span>
            </button>
          </div>
          <p className="mt-2 text-[11px] text-gray-500">
            Generates a CSV snapshot of all active club members and roles.
          </p>
        </div>
      )}

      {/* Upcoming events */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#050709]/80 backdrop-blur-xl p-4 sm:p-5 shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
        <div className="pointer-events-none absolute -top-14 -left-10 h-24 w-24 rounded-full bg-[#05acc1]/5 blur-3xl" />
        <div className="flex items-center justify-between gap-2 mb-3">
          <p className="text-sm font-semibold">Upcoming Events</p>
          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-gray-500">
            ./events ls
          </span>
        </div>

        {recentEvents.length === 0 && (
          <p className="text-xs text-gray-500">
            No events created yet. Spin up a new one from the Events panel.
          </p>
        )}

        <div className="space-y-2">
          {recentEvents.map((ev) => (
            <div
              key={ev._id}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/20 px-3 py-2 text-xs"
            >
              <div className="min-w-0">
                <p className="font-medium truncate">{ev.title}</p>
                <p className="text-[11px] text-gray-500 truncate">
                  {ev.type} ·{" "}
                  {new Date(ev.date).toLocaleDateString(undefined, {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <span
                className={`whitespace-nowrap px-2 py-1 rounded-full text-[10px] font-semibold ${
                  ev.type === "technical"
                    ? "bg-[#05acc1]/15 text-[#05acc1]"
                    : "bg-[#6bdbd1]/15 text-[#6bdbd1]"
                }`}
              >
                {ev.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
