// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    domain: user?.domain || "",
    year: user?.year || "",
    imageUrl: user?.imageUrl || "",
    file: null
  });
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get("/users/me");
        const me = res.data;
        setForm((prev) => ({
          ...prev,
          name: me.name || "",
          email: me.email || "",
          domain: me.domain || "",
          year: me.year || "",
          imageUrl: me.imageUrl || "",
          file: null
        }));
        updateUser(me);
      } catch (_) {}
    };
    fetchMe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({
      ...prev,
      file,
      imageUrl: URL.createObjectURL(file)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSaving(true);

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("email", form.email);
      fd.append("domain", form.domain);
      fd.append("year", form.year);
      if (form.file) {
        fd.append("image", form.file);
      }

      const res = await api.put("/users/me", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setMessage("Profile updated.");
      updateUser(res.data);
      setForm((prev) => ({
        ...prev,
        imageUrl: res.data.imageUrl,
        file: null
      }));
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Profile
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Manage your identity inside the X‑Kernel admin space.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#050709] px-3 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-gray-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#05acc1] opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#05acc1]" />
          </span>
          ./me
        </span>
      </div>

      {/* Avatar + summary */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#050709]/80 backdrop-blur-xl p-4 sm:p-5 shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
        <div className="pointer-events-none absolute -top-16 right-0 h-28 w-28 rounded-full bg-[#05acc1]/10 blur-3xl" />
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="relative h-16 w-16 sm:h-20 sm:w-20">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#05acc1] to-[#09969f] opacity-60 blur-lg" />
            <div className="relative h-full w-full rounded-full border border-white/15 bg-[#020409] overflow-hidden flex items-center justify-center text-xl sm:text-2xl font-semibold text-[#05acc1]">
              {form.imageUrl ? (
                <img
                  src={form.imageUrl}
                  alt={form.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                (form.name || "X").charAt(0)
              )}
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-sm sm:text-base font-medium truncate">
              {form.name || "Your name"}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {form.email}
            </p>
            {(form.domain || form.year) && (
              <p className="mt-1 text-[11px] text-gray-500 truncate">
                {form.domain && `${form.domain}`}{" "}
                {form.domain && form.year && "· "} 
                {form.year && `${form.year}`}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#050709]/80 backdrop-blur-xl p-4 sm:p-5 shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
        <div className="pointer-events-none absolute -top-16 left-0 h-28 w-28 rounded-full bg-[#6bdbd1]/10 blur-3xl" />
        <p className="text-sm font-semibold mb-3 flex items-center gap-2">
          Edit Details
          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#05acc1]">
            profile update
          </span>
        </p>

        {message && (
          <div
            className={`mb-3 text-[11px] px-3 py-2 rounded-md border ${
              message.toLowerCase().includes("updated")
                ? "bg-[#05acc1]/10 border-[#05acc1]/40 text-[#05acc1]"
                : "bg-red-500/10 border-red-500/40 text-red-300"
            }`}
          >
            {message}
          </div>
        )}

        <form
          className="grid gap-3 sm:gap-4 md:grid-cols-2 text-sm"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block text-[11px] mb-1 text-gray-300 uppercase tracking-[0.12em]">
              Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-xl bg-[#020409] border border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#05acc1]/70 focus:border-[#05acc1]/60 placeholder:text-gray-700"
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] mb-1 text-gray-300 uppercase tracking-[0.12em]">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-xl bg-[#020409] border border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#05acc1]/70 focus:border-[#05acc1]/60 placeholder:text-gray-700"
              placeholder="you@griet.in"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] mb-1 text-gray-300 uppercase tracking-[0.12em]">
              Domain
            </label>
            <input
              name="domain"
              value={form.domain}
              onChange={handleChange}
              className="w-full rounded-xl bg-[#020409] border border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#05acc1]/70 focus:border-[#05acc1]/60 placeholder:text-gray-700"
              placeholder="Web Dev / Design / ML / etc."
            />
          </div>

          <div>
            <label className="block text-[11px] mb-1 text-gray-300 uppercase tracking-[0.12em]">
              Year
            </label>
            <input
              name="year"
              value={form.year}
              onChange={handleChange}
              className="w-full rounded-xl bg-[#020409] border border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#05acc1]/70 focus:border-[#05acc1]/60 placeholder:text-gray-700"
              placeholder="2nd / 3rd / 4th"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[11px] mb-1 text-gray-300 uppercase tracking-[0.12em]">
              Profile Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-[11px] text-gray-300 file:mr-3 file:rounded-full file:border-0 file:bg-[#05acc1]/15 file:px-3 file:py-1 file:text-[10px] file:font-semibold file:text-[#05acc1] file:hover:bg-[#05acc1]/25"
            />
          </div>

          <div className="md:col-span-2 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="relative overflow-hidden inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#05acc1] text-[#020403] text-xs font-bold uppercase tracking-[0.18em] hover:shadow-[0_0_18px_rgba(5,172,193,0.55)] transition-all hover:-translate-y-0.5 disabled:opacity-60"
            >
              <span className="absolute inset-0 bg-white/20 translate-y-full hover:translate-y-0 transition-transform duration-300" />
              <span className="relative">
                {saving ? "Saving..." : "Save Changes"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
