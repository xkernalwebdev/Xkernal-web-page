// src/pages/Layout.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const navItemBase =
  "flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-all";
const navItemInactive =
  "text-gray-300 hover:text-white hover:bg-white/5";
const navItemActive =
  "bg-[#05acc1]/15 text-[#05acc1] shadow-[0_0_18px_rgba(5,172,193,0.35)]";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-[#020403] text-slate-50">
      {/* Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 border-r border-white/10 bg-[#050709]/80 backdrop-blur-2xl shadow-[0_18px_60px_rgba(0,0,0,0.7)]">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-xl bg-gradient-to-br from-[#05acc1] to-[#09969f] p-[1px]">
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative h-full w-full bg-[#020403] rounded-[10px] flex items-center justify-center font-black text-[#05acc1] text-lg">
                X
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide">
                X‑Kernel
              </p>
              <p className="text-[10px] text-gray-400 uppercase tracking-[0.18em]">
                Club Portal
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `${navItemBase} ${isActive ? navItemActive : navItemInactive}`
            }
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-base">
              📊
            </span>
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/dashboard/team"
            className={({ isActive }) =>
              `${navItemBase} ${isActive ? navItemActive : navItemInactive}`
            }
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-base">
              👥
            </span>
            <span>Team</span>
          </NavLink>

          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) =>
              `${navItemBase} ${isActive ? navItemActive : navItemInactive}`
            }
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-base">
              🧑
            </span>
            <span>Profile</span>
          </NavLink>

          <NavLink
            to="/dashboard/events"
            className={({ isActive }) =>
              `${navItemBase} ${isActive ? navItemActive : navItemInactive}`
            }
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-base">
              📅
            </span>
            <span>Events</span>
          </NavLink>

          <NavLink
            to="/dashboard/members"
            className={({ isActive }) =>
              `${navItemBase} ${isActive ? navItemActive : navItemInactive}`
            }
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-base">
              ➕
            </span>
            <span>Members</span>
          </NavLink>
        </nav>

        <div className="border-t border-white/10 p-4 flex items-center justify-between bg-black/20 backdrop-blur-xl">
          {user ? (
            <>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400">
                  Signed in as
                </p>
                <p className="text-sm font-medium truncate">
                  {user.name}{" "}
                  <span className="text-gray-400 text-xs">
                    ({user.role})
                  </span>
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="text-[11px] px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <p className="text-xs text-gray-400">Not signed in</p>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-16 border-b border-white/10 bg-[#050709]/70 backdrop-blur-2xl flex items-center justify-between px-4 md:px-6 shadow-[0_10px_30px_rgba(0,0,0,0.7)]">
          <div
            className="flex items-center gap-2 cursor-pointer md:hidden"
            onClick={() => navigate("/")}
          >
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#05acc1] to-[#09969f] flex items-center justify-center font-black text-[#020403] text-sm">
              X
            </div>
            <p className="font-semibold text-sm">X‑Kernel Portal</p>
          </div>

          <div className="flex-1 flex justify-end">
            {user && (
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-sm text-gray-200 truncate max-w-[140px]">
                  {user.name}
                </span>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-200 uppercase tracking-[0.16em]">
                  {user.role}
                </span>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 bg-[#020403]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
