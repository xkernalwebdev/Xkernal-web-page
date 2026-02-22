import React, { useEffect, useState } from "react";
import api from "../api/axios.js";

const MembersManage = () => {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "member", // admin / lead / jr_lead / member
    domain: "",
    year: "",
    imageUrl: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadMembers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users/public");
      setMembers(res.data);
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.name || !form.email || !form.password) {
      setMessage("Name, email, and password are required.");
      return;
    }

    setSaving(true);
    try {
      await api.post("/auth/members", form);
      setMessage("Member added successfully.");

      setForm({
        name: "",
        email: "",
        role: "member",
        domain: "",
        year: "",
        imageUrl: "",
        password: "",
      });

      await loadMembers();
    } catch (err) {
      console.log(err.response?.data);
      setMessage(
        err.response?.data?.message || "Failed to add member."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this member?")) return;
    setLoading(true);
    try {
      // await api.delete(`/users/${id}`);
      await loadMembers();
    } catch (_) {}
    setLoading(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Members Matrix
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Add core team, assign roles, and review current members.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#050709] px-3 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-gray-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#05acc1] opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#05acc1]" />
          </span>
          ./members.sh
        </span>
      </div>

      {/* Add member form */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#050709]/80 backdrop-blur-xl p-4 sm:p-5 shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
        <div className="pointer-events-none absolute -top-16 right-0 h-28 w-28 rounded-full bg-[#05acc1]/10 blur-3xl" />
        <p className="text-sm font-semibold mb-3 flex items-center gap-2">
          Add Member
          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#05acc1]">
            user add
          </span>
        </p>

        {message && (
          <div
            className={`mb-3 text-[11px] px-3 py-2 rounded-md border ${
              message.toLowerCase().includes("success")
                ? "bg-[#05acc1]/10 border-[#05acc1]/40 text-[#05acc1]"
                : "bg-red-500/10 border-red-500/40 text-red-300"
            }`}
          >
            {message}
          </div>
        )}

        <form
          className="grid gap-3 sm:gap-4 md:grid-cols-2 text-sm"
          onSubmit={handleCreate}
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
              placeholder="Member Name"
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
              placeholder="member@griet.in"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] mb-1 text-gray-300 uppercase tracking-[0.12em]">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-xl bg-[#020409] border border.white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#05acc1]/70 focus:border-[#05acc1]/60 placeholder:text-gray-700"
              placeholder="Set initial password"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] mb-1 text-gray-300 uppercase tracking-[0.12em]">
              Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-xl bg-[#020409] border border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#05acc1]/70 focus:border-[#05acc1]/60 text-gray-200"
            >
              <option value="admin">Admin</option>
              <option value="lead">Lead</option>
              <option value="jr_lead">Jr Lead</option>
              <option value="member">Member</option>
            </select>
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

          <div>
            <label className="block text-[11px] mb-1 text-gray-300 uppercase tracking-[0.12em]">
              Image URL (optional)
            </label>
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              className="w-full rounded-xl bg-[#020409] border border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#05acc1]/70 focus:border-[#05acc1]/60 placeholder:text-gray-700"
              placeholder="https://..."
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
                {saving ? "Saving..." : "Add Member"}
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* Members list */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#050709]/80 backdrop-blur-xl p-4 sm:p-5 shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
        <div className="pointer-events-none absolute -top-16 left-0 h-28 w-28 rounded-full bg-[#6bdbd1]/10 blur-3xl" />
        <div className="flex items-center justify-between gap-2 mb-3">
          <p className="text-sm font-semibold">Current Members</p>
          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-gray-500">
            ./members list
          </span>
        </div>

        {loading && (
          <p className="text-xs text-gray-500 mb-2">Loading...</p>
        )}
        {members.length === 0 && !loading && (
          <p className="text-xs text-gray-500">No members yet.</p>
        )}

        {members.length > 0 && (
          <div className="overflow-x-auto mt-2 rounded-xl border border-white/5 bg-black/20">
            <table className="min-w-full text-[11px] sm:text-xs">
              <thead>
                <tr className="text-left text-gray-400 border-b border-white/10">
                  <th className="py-2.5 pl-3 pr-4 font-normal">Name</th>
                  <th className="py-2.5 pr-4 font-normal">Email</th>
                  <th className="py-2.5 pr-4 font-normal">Role</th>
                  <th className="py-2.5 pr-4 font-normal">Domain</th>
                  <th className="py-2.5 pr-4 font-normal">Year</th>
                  <th className="py-2.5 pr-3 font-normal text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr
                    key={m._id}
                    className="border-b border-white/5 last:border-0"
                  >
                    <td className="py-2.5 pl-3 pr-4 align-middle">
                      <p className="font-medium text-white truncate max-w-[160px] sm:max-w-xs">
                        {m.name}
                      </p>
                    </td>
                    <td className="py-2.5 pr-4 align-middle text-gray-300 truncate max-w-[180px] sm:max-w-xs">
                      {m.email}
                    </td>
                    <td className="py-2.5 pr-4 align-middle text-gray-300 capitalize">
                      {m.role}
                    </td>
                    <td className="py-2.5 pr-4 align-middle text-gray-300">
                      {m.domain}
                    </td>
                    <td className="py-2.5 pr-4 align-middle text-gray-300">
                      {m.year}
                    </td>
                    <td className="py-2.5 pr-3 align-middle">
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleDelete(m._id)}
                          className="px-3 py-1.5 rounded-full bg-red-500/15 text-red-300 text-[10px] font-semibold hover:bg-red-500/25 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MembersManage;
