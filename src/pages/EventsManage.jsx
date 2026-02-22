// src/pages/EventsManage.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const EventsManage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    type: "technical",
    description: "",
    about: "",
    date: "",
    entryFee: "",
  });
  const [imageFile, setImageFile] = useState(null); // NEW
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");

  const canExport =
    user && (user.role === "admin" || user.role === "lead");

  const loadEvents = async () => {
    try {
      const res = await api.get("/events");
      setEvents(
        res.data.sort((a, b) => new Date(a.date) - new Date(b.date))
      );
    } catch (_) {}
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    setImageFile(file || null);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage("");

    if (
      !form.title ||
      !form.description ||
      !form.date ||
      form.entryFee === ""
    ) {
      setMessage("All fields are required, including entry fee.");
      return;
    }

    const feeNumber = Number(form.entryFee);
    if (Number.isNaN(feeNumber) || feeNumber < 0) {
      setMessage("Entry fee must be a non-negative number.");
      return;
    }

    setCreating(true);
    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("type", form.type);
      data.append("description", form.description);
      data.append("about", form.about || "");
      data.append("date", form.date);
      data.append("entryFee", String(feeNumber));
      if (imageFile) {
        data.append("image", imageFile); // must match upload.single("image")
      }

      await api.post("/events", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setForm({
        title: "",
        type: "technical",
        description: "",
        about: "",
        date: "",
        entryFee: "",
      });
      setImageFile(null);
      setMessage("Event created.");
      await loadEvents();
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Failed to create event."
      );
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    setLoading(true);
    try {
      await api.delete(`/events/${id}`);
      await loadEvents();
    } catch (_) {}
    setLoading(false);
  };

  const exportEventRegistrations = async (eventId, title) => {
    try {
      const res = await api.get(`/registrations/event/${eventId}/csv`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `registrations_${title || eventId}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      const status = err.response?.status;
      alert(
        status === 404
          ? "CSV export is not available for this event yet."
          : "Failed to export registrations. Please try again."
      );
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Events Console
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Create, monitor, and export registrations for X‑Kernel events.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#050709] px-3 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-gray-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#05acc1] opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#05acc1]" />
          </span>
          ./events_manage.sh
        </span>
      </div>

      {/* Create form */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#050709]/80 backdrop-blur-xl p-4 sm:p-5 shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
        <div className="pointer-events-none absolute -top-16 right-0 h-28 w-28 rounded-full bg-[#05acc1]/10 blur-3xl" />
        <p className="text-sm font-semibold mb-3 flex items-center gap-2">
          Create Event
          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#05acc1]">
            new node
          </span>
        </p>
        {message && (
          <div
            className={`mb-3 text-[11px] px-3 py-2 rounded-md border ${
              message.toLowerCase().includes("created")
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
          <div className="md:col-span-2">
            <label className="block text-[11px] mb-1 text-gray-300 uppercase tracking-[0.12em]">
              Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-xl bg-[#020409] border border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#05acc1]/70 focus:border-[#05acc1]/60 placeholder:text-gray-700"
              placeholder="CPL - Coding Premier League"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] mb-1 text-gray-300 uppercase tracking-[0.12em]">
              Type
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full rounded-xl bg-[#020409] border border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#05acc1]/70 focus:border-[#05acc1]/60 text-gray-200"
            >
              <option value="technical">Technical</option>
              <option value="non-technical">Non‑Technical</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] mb-1 text-gray-300 uppercase tracking-[0.12em]">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full rounded-xl bg-[#020409] border border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#05acc1]/70 focus:border-[#05acc1]/60"
              required
            />
          </div>

          {/* Entry fee */}
          <div>
            <label className="block text-[11px] mb-1 text-gray-300 uppercase tracking-[0.12em]">
              Entry Fee (₹)
            </label>
            <input
              type="number"
              min="0"
              name="entryFee"
              value={form.entryFee}
              onChange={handleChange}
              className="w-full rounded-xl bg-[#020409] border border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#05acc1]/70 focus:border-[#05acc1]/60 placeholder:text-gray-700"
              placeholder="50"
              required
            />
          </div>

          {/* Image upload */}
          <div className="md:col-span-2">
            <label className="block text-[11px] mb-1 text-gray-300 uppercase tracking-[0.12em]">
              Event Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-xs text-gray-300 file:mr-3 file:rounded-md file:border-0 file:bg-[#05acc1]/20 file:px-3 file:py-1.5 file:text-[10px] file:uppercase file:tracking-[0.16em] file:text-[#05acc1]"
            />
            <p className="mt-1 text-[10px] text-gray-500">
              Upload poster or banner image (max 2 MB).
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-[11px] mb-1 text-gray-300 uppercase tracking-[0.12em]">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-xl bg-[#020409] border border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#05acc1]/70 focus:border-[#05acc1]/60 placeholder:text-gray-700"
              placeholder="Brief description of the event"
              required
            />
          </div>

          {/* About the event */}
          <div className="md:col-span-2">
            <label className="block text-[11px] mb-1 text-gray-300 uppercase tracking-[0.12em]">
              About the Event
            </label>
            <textarea
              name="about"
              value={form.about}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-xl bg-[#020409] border border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#05acc1]/70 focus:border-[#05acc1]/60 placeholder:text-gray-700"
              placeholder="Detailed info: rules, rounds, schedule, etc."
            />
          </div>

          <div className="md:col-span-2 pt-1">
            <button
              type="submit"
              disabled={creating}
              className="relative overflow-hidden inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#05acc1] text-[#020403] text-xs font-bold uppercase tracking-[0.18em] hover:shadow-[0_0_18px_rgba(5,172,193,0.55)] transition-all hover:-translate-y-0.5 disabled:opacity-60"
            >
              <span className="absolute inset-0 bg-white/20 translate-y-full hover:translate-y-0 transition-transform duration-300" />
              <span className="relative">
                {creating ? "Creating..." : "Create Event"}
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* Events list */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#050709]/80 backdrop-blur-xl p-4 sm:p-5 shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
        <div className="pointer-events-none absolute -top-16 left-0 h-28 w-28 rounded-full bg-[#09969f]/10 blur-3xl" />
        <div className="flex items-center justify-between gap-2 mb-3">
          <p className="text-sm font-semibold">All Events</p>
          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-gray-500">
            ./events list
          </span>
        </div>

        {events.length === 0 && (
          <p className="text-xs text-gray-500">No events yet.</p>
        )}

        {events.length > 0 && (
          <div className="overflow-x-auto mt-2 rounded-xl border border-white/5 bg-black/20">
            <table className="min-w-full text-[11px] sm:text-xs">
              <thead>
                <tr className="text-left text-gray-400 border-b border-white/10">
                  <th className="py-2.5 pl-3 pr-4 font-normal">Title</th>
                  <th className="py-2.5 pr-4 font-normal">Type</th>
                  <th className="py-2.5 pr-4 font-normal">Date</th>
                  <th className="py-2.5 pr-4 font-normal">Fee (₹)</th>
                  <th className="py-2.5 pr-3 font-normal text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr
                    key={ev._id}
                    className="border-b border-white/5 last:border-0"
                  >
                    <td className="py-2.5 pl-3 pr-4 align-middle">
                      <p className="font-medium text-white truncate max-w-[180px] sm:max-w-xs">
                        {ev.title}
                      </p>
                    </td>
                    <td className="py-2.5 pr-4 align-middle capitalize text-gray-300">
                      {ev.type}
                    </td>
                    <td className="py-2.5 pr-4 align-middle text-gray-300 whitespace-nowrap">
                      {new Date(ev.date).toLocaleDateString()}
                    </td>
                    <td className="py-2.5 pr-4 align-middle text-gray-300">
                      {typeof ev.entryFee === "number"
                        ? `₹${ev.entryFee}`
                        : "-"}
                    </td>
                    <td className="py-2.5 pr-3 align-middle">
                      <div className="flex flex-wrap gap-2 justify-end">
                        {canExport && (
                          <button
                            onClick={() =>
                              exportEventRegistrations(ev._id, ev.title)
                            }
                            className="px-3 py-1.5 rounded-full bg-[#05acc1]/15 text-[#05acc1] text-[10px] font-semibold hover:bg-[#05acc1]/25 transition-colors"
                          >
                            Export CSV
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(ev._id)}
                          disabled={loading}
                          className="px-3 py-1.5 rounded-full bg-red-500/15 text-red-300 text-[10px] font-semibold hover:bg-red-500/25 disabled:opacity-50 transition-colors"
                        >
                          Delete
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

export default EventsManage;
