import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const { user, login, setLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  if (user) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      const { token, ...userData } = res.data;
      login(userData, token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#020403] overflow-hidden px-4">
      {/* background blobs + noise, same palette as landing */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute -top-20 -left-16 w-64 h-64 sm:w-80 sm:h-80 bg-[#05acc1] rounded-full mix-blend-screen blur-[120px] opacity-20" />
        <div className="absolute -bottom-24 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-[#09969f] rounded-full mix-blend-screen blur-[130px] opacity-20" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      </div>

      <div className="w-full max-w-md">
        <div className="relative bg-[#050709]/80 border border-white/10 backdrop-blur-2xl rounded-2xl px-5 sm:px-6 py-6 sm:py-8 shadow-[0_24px_60px_rgba(0,0,0,0.7)] overflow-hidden">
          {/* corner glow */}
          <div className="pointer-events-none absolute -top-16 right-0 h-32 w-32 rounded-full bg-[#05acc1]/15 blur-3xl" />

          {/* header */}
          <div className="flex items-center gap-3 mb-6 sm:mb-7">
            <div className="relative h-9 w-9 sm:h-10 sm:w-10 overflow-hidden rounded-xl bg-gradient-to-br from-[#05acc1] to-[#09969f] p-[1px]">
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative h-full w-full bg-[#020403] rounded-[10px] flex items-center justify-center font-black text-[#05acc1] text-lg">
                X
              </div>
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-semibold">
                X‑Kernel Club Portal
              </h1>
              <p className="text-[11px] text-gray-400">
                Core team &amp; admins sign in here.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 text-[11px] sm:text-sm text-red-300 bg-red-500/10 border border-red-500/40 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[11px] font-semibold text-gray-300 mb-1 uppercase tracking-[0.14em]">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl bg-[#020409] border border-white/10 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#05acc1]/80 focus:border-[#05acc1]/70 placeholder:text-gray-700"
                placeholder="admin@xkernel.in"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-300 mb-1 uppercase tracking-[0.14em]">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-xl bg-[#020409] border border-white/10 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#05acc1]/80 focus:border-[#05acc1]/70 placeholder:text-gray-700"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="relative w-full mt-2 inline-flex justify-center items-center gap-2 rounded-xl bg-[#05acc1] text-[#020403] font-bold text-xs sm:text-sm py-2.5 sm:py-3 tracking-[0.18em] uppercase overflow-hidden group hover:shadow-[0_0_20px_rgba(5,172,193,0.6)] transition-all hover:-translate-y-0.5"
            >
              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative">Sign in</span>
            </button>
          </form>

          <p className="mt-4 text-[10px] sm:text-[11px] text-gray-500 text-center">
            Students don&apos;t need login. They can directly register for
            events from the main site.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
