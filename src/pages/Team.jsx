
import React, { useEffect, useMemo, useState } from "react";
import api from "../api/axios.js";

const roleOrder = { admin: 0, lead: 1, jr_lead: 2, member: 3 };

const Team = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api
      .get("/users/public")
      .then((res) => setUsers(res.data))
      .catch(() => {});
  }, []);

  const grouped = useMemo(() => {
    const byDomain = {};
    for (const u of users) {
      const d = u.domain || "General";
      if (!byDomain[d]) byDomain[d] = [];
      byDomain[d].push(u);
    }
    for (const d of Object.keys(byDomain)) {
      byDomain[d].sort(
        (a, b) => (roleOrder[a.role] || 99) - (roleOrder[b.role] || 99)
      );
    }
    return byDomain;
  }, [users]);

  const domains = Object.keys(grouped);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Team
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            View the active core across domains, sorted by role.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#050709] px-3 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-gray-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#05acc1] opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#05acc1]" />
          </span>
          ./team grid
        </span>
      </div>

      {domains.length === 0 && (
        <p className="text-sm text-gray-500">No active members yet.</p>
      )}

      <div className="space-y-6">
        {domains.map((domain) => (
          <div key={domain} className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-[0.2em]">
                {domain}
              </h2>
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-gray-500">
                {grouped[domain].length} members
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {grouped[domain].map((u) => (
                <div
                  key={u._id}
                  className="relative flex items-center gap-3 rounded-2xl border border-white/10 bg-[#050709]/80 backdrop-blur-xl p-3.5 shadow-[0_14px_30px_rgba(0,0,0,0.5)]"
                >
                  <div className="pointer-events-none absolute -top-8 -right-8 h-16 w-16 rounded-full bg-[#05acc1]/10 blur-3xl" />
                  <div className="relative h-10 w-10 shrink-0">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#05acc1] to-[#09969f] opacity-60 blur" />
                    <div className="relative h-full w-full rounded-full border border-white/15 bg-[#020409] overflow-hidden flex items-center justify-center text-sm font-semibold text-[#05acc1]">
                      {u.imageUrl ? (
                        <img
                          src={u.imageUrl}
                          alt={u.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        (u.name || "X").charAt(0)
                      )}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {u.name}
                    </p>
                    <p className="text-[11px] text-gray-400 truncate">
                      {u.role}
                      {u.domain ? ` · ${u.domain}` : ""}
                    </p>
                  </div>
                  {u.role !== "member" && (
                    <span className="ml-auto text-[9px] font-semibold uppercase tracking-[0.16em] rounded-full bg-[#05acc1]/10 text-[#05acc1] px-2 py-1">
                      {u.role}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
