"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, X, Calendar, Clock, MapPin, Phone, Mail, CheckCircle, Circle, AlertCircle } from "lucide-react";

const ORG_ID = "d1000000-0000-0000-0000-000000000001";

// ── Types ──
type Checkin = {
  id: string; owner_id: string; scheduled_date: string; scheduled_time?: string;
  status: "awaiting" | "scheduled" | "completed" | "noshow";
  booking_link?: string; raw_notes?: string; ai_summary?: string;
  combined_summary?: string; recording_url?: string;
  owner?: { id: string; full_name: string; email?: string; phone?: string; property_address: string; };
};

// ════════════════════════════════════════════════════════════
// Add Checkin Modal
// ════════════════════════════════════════════════════════════
function AddCheckinModal({ onClose, onCreated }: { onClose: () => void; onCreated: (c: any) => void }) {
  const [owners, setOwners] = useState<any[]>([]);
  const [ownerId, setOwnerId] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [bookingLink, setBookingLink] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/owners", { headers: { "x-org-id": ORG_ID } })
      .then(r => r.json()).then(d => setOwners(d.data || [])).catch(() => {});
  }, []);

  const submit = async () => {
    if (!ownerId || !scheduledDate) { setError("Owner and date are required."); return; }
    setSubmitting(true); setError("");
    try {
      const res = await fetch("/api/checkins", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-org-id": ORG_ID },
        body: JSON.stringify({
          owner_id: ownerId, scheduled_date: scheduledDate,
          scheduled_time: scheduledTime || null, booking_link: bookingLink || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      onCreated(json.data);
      onClose();
    } catch (e: any) { setError(e.message); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} onClick={onClose}>
      <div className="rounded-xl p-6 w-full max-w-md" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold" style={{ color: "var(--text)" }}>Schedule Check-in</h3>
          <button onClick={onClose} style={{ color: "var(--text3)" }}><X size={20} /></button>
        </div>
        <div className="space-y-3">
          <select className="w-full rounded-lg px-3 py-2.5 text-lg border font-bold" style={{ backgroundColor: "var(--bg)", color: "var(--text)", borderColor: "var(--border)" }} value={ownerId} onChange={(e) => setOwnerId(e.target.value)}>
            <option value="">Select owner *</option>
            {owners.map((o: any) => (
              <option key={o.id} value={o.id}>{o.full_name} - {o.property_address}</option>
            ))}
          </select>
          <input className="w-full rounded-lg px-3 py-2.5 text-lg border font-bold" style={{ backgroundColor: "var(--bg)", color: "var(--text)", borderColor: "var(--border)" }} type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
          <input className="w-full rounded-lg px-3 py-2.5 text-lg border font-bold" style={{ backgroundColor: "var(--bg)", color: "var(--text)", borderColor: "var(--border)" }} type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} />
          <input className="w-full rounded-lg px-3 py-2.5 text-lg border font-bold" style={{ backgroundColor: "var(--bg)", color: "var(--text)", borderColor: "var(--border)" }} placeholder="Booking link (optional)" value={bookingLink} onChange={(e) => setBookingLink(e.target.value)} />
        </div>
        {error && <p className="text-lg font-bold mt-3" style={{ color: "#e03131" }}>{error}</p>}
        <button className="w-full mt-4 rounded-lg py-2.5 text-lg font-bold" style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }} onClick={submit} disabled={submitting}>
          {submitting ? "Scheduling..." : "Schedule Check-in"}
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// Checkin Detail Slideover
// ════════════════════════════════════════════════════════════
function CheckinSlideover({ checkin, onClose, onStatusUpdate }: {
  checkin: Checkin; onClose: () => void;
  onStatusUpdate: (id: string, status: string) => void;
}) {
  const [updating, setUpdating] = useState(false);
  const owner = checkin.owner;
  const now = new Date();
  const checkinDate = new Date(checkin.scheduled_date + (checkin.scheduled_time ? "T" + checkin.scheduled_time : ""));
  const isPast = checkinDate < now;

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/checkins/${checkin.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-org-id": ORG_ID },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed");
      onStatusUpdate(checkin.id, newStatus);
    } catch (e) { console.error(e); }
    finally { setUpdating(false); }
  };

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} onClick={onClose} />
      <div className="relative ml-auto w-full max-w-lg h-full overflow-y-auto shadow-2xl" style={{ backgroundColor: "var(--bg)", borderLeft: "1px solid var(--border)" }}>
        {/* Header */}
        <div className="sticky top-0 z-10 p-5 border-b-[3px]" style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)" }}>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>{owner?.full_name || "Owner"}</h2>
              <p className="text-lg font-bold" style={{ color: "var(--accent)" }}>{owner?.property_address}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:opacity-70" style={{ backgroundColor: "var(--surface3)", color: "var(--text)" }}>
              <X size={20} />
            </button>
          </div>
          <div className="flex flex-wrap gap-3 mt-3">
            <span className="text-lg font-bold px-3 py-1.5 rounded-lg border-[3px]" style={{
              backgroundColor: checkin.status === "completed" ? "#e6fcf5" : checkin.status === "scheduled" ? "#fff4e6" : "#f0f4ff",
              borderColor: checkin.status === "completed" ? "#0ca678" : checkin.status === "scheduled" ? "#f76707" : "#4c6ef5",
              color: checkin.status === "completed" ? "#0ca678" : checkin.status === "scheduled" ? "#f76707" : "#4c6ef5",
            }}>
              {checkin.status.toUpperCase()}
            </span>
            <span className="text-lg font-bold px-3 py-1.5 rounded-lg border-[3px]" style={{ borderColor: "#adb5bd", color: "#495057" }}>
              <Calendar size={16} className="inline mr-1" />{checkin.scheduled_date}
              {checkin.scheduled_time && ` at ${checkin.scheduled_time}`}
            </span>
          </div>
          {owner?.email && <p className="text-lg mt-2 font-bold" style={{ color: "var(--text2)" }}><Mail size={16} className="inline mr-1" />{owner.email}</p>}
          {owner?.phone && <p className="text-lg font-bold" style={{ color: "var(--text2)" }}><Phone size={16} className="inline mr-1" />{owner.phone}</p>}
        </div>

        <div className="p-5 space-y-6">
          {/* Status actions */}
          <section>
            <h3 className="text-lg font-bold mb-3" style={{ color: "var(--text)" }}>Update Status</h3>
            <div className="flex flex-wrap gap-2">
              {checkin.status !== "scheduled" && (
                <button onClick={() => updateStatus("scheduled")} disabled={updating}
                  className="text-lg font-bold px-4 py-2 rounded-lg border-[3px]" style={{
                    backgroundColor: "#fff4e6", borderColor: "#f76707", color: "#f76707",
                  }}>Mark Scheduled</button>
              )}
              {checkin.status !== "completed" && isPast && (
                <button onClick={() => updateStatus("completed")} disabled={updating}
                  className="text-lg font-bold px-4 py-2 rounded-lg border-[3px]" style={{
                    backgroundColor: "#e6fcf5", borderColor: "#0ca678", color: "#0ca678",
                  }}>Mark Completed</button>
              )}
              {checkin.status !== "noshow" && isPast && checkin.status !== "completed" && (
                <button onClick={() => updateStatus("noshow")} disabled={updating}
                  className="text-lg font-bold px-4 py-2 rounded-lg border-[3px]" style={{
                    backgroundColor: "#ffe3e3", borderColor: "#e03131", color: "#e03131",
                  }}>Mark No-Show</button>
              )}
            </div>
          </section>

          {/* Notes */}
          <section>
            <h3 className="text-lg font-bold mb-3" style={{ color: "var(--text)" }}>Notes</h3>
            <div className="p-4 rounded-lg border-[3px] text-lg font-bold" style={{
              backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text2)",
              minHeight: "80px",
            }}>
              {checkin.raw_notes || checkin.combined_summary || checkin.ai_summary || "No notes yet."}
            </div>
          </section>

          {/* AI Summary */}
          {checkin.ai_summary && (
            <section>
              <h3 className="text-lg font-bold mb-3" style={{ color: "#7950f2" }}>AI Summary</h3>
              <div className="p-4 rounded-lg border-[3px] text-lg font-bold" style={{
                backgroundColor: "#f3f0ff", borderColor: "#c4b5fd", color: "#495057",
              }}>
                {checkin.ai_summary}
              </div>
            </section>
          )}

          {/* Booking link */}
          {checkin.booking_link && (
            <section>
              <h3 className="text-lg font-bold mb-3" style={{ color: "var(--text)" }}>Booking Link</h3>
              <a href={checkin.booking_link} target="_blank" rel="noopener noreferrer"
                className="text-lg font-bold underline" style={{ color: "#4c6ef5" }}>
                {checkin.booking_link}
              </a>
            </section>
          )}

          {/* Recording */}
          {checkin.recording_url && (
            <section>
              <h3 className="text-lg font-bold mb-3" style={{ color: "var(--text)" }}>Recording</h3>
              <a href={checkin.recording_url} target="_blank" rel="noopener noreferrer"
                className="text-lg font-bold underline" style={{ color: "#4c6ef5" }}>
                Open Recording
              </a>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// Main Owner Checkins Client
// ════════════════════════════════════════════════════════════
export default function OwnerCheckinsClient({ initialCheckins }: { initialCheckins: Checkin[] }) {
  const [checkins, setCheckins] = useState<Checkin[]>(initialCheckins);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedCheckin = useMemo(() =>
    checkins.find((c) => c.id === selectedId) || null, [checkins, selectedId]
  );

  // Split into 3 sections
  const { awaiting, scheduled, completed } = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const a: Checkin[] = [];
    const s: Checkin[] = [];
    const c: Checkin[] = [];

    checkins.forEach((ch) => {
      if (ch.status === "completed") {
        c.push(ch);
      } else if (ch.status === "awaiting") {
        a.push(ch);
      } else if (ch.status === "scheduled") {
        s.push(ch);
      } else if (ch.status === "noshow") {
        c.push(ch); // noshows go to completed/historical
      }
    });

    // Sort: awaiting by date asc, scheduled by date asc, completed by date desc
    a.sort((x, y) => x.scheduled_date.localeCompare(y.scheduled_date));
    s.sort((x, y) => x.scheduled_date.localeCompare(y.scheduled_date));
    c.sort((x, y) => y.scheduled_date.localeCompare(x.scheduled_date));

    return { awaiting: a, scheduled: s, completed: c };
  }, [checkins]);

  const handleStatusUpdate = (id: string, newStatus: string) => {
    setCheckins((prev) => prev.map((c) =>
      c.id === id ? { ...c, status: newStatus as Checkin["status"] } : c
    ));
  };

  return (
    <div className="px-4 sm:px-6 pt-4 pb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>
          Owner Check-ins · {checkins.length} total
        </h2>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-lg font-bold border-[3px]"
          style={{ backgroundColor: "var(--accent)", color: "#fff", borderColor: "var(--accent)" }}
        >
          <Plus size={20} /> Schedule
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl border-[3px]" style={{ backgroundColor: "#f0f4ff", borderColor: "#b8ccff" }}>
          <p className="text-lg font-bold" style={{ color: "#4c6ef5" }}>Awaiting Booking</p>
          <p className="text-3xl font-bold mt-1" style={{ color: "#4c6ef5" }}>{awaiting.length}</p>
        </div>
        <div className="p-4 rounded-xl border-[3px]" style={{ backgroundColor: "#fff4e6", borderColor: "#ffc078" }}>
          <p className="text-lg font-bold" style={{ color: "#f76707" }}>Scheduled This Week</p>
          <p className="text-3xl font-bold mt-1" style={{ color: "#f76707" }}>{scheduled.length}</p>
        </div>
        <div className="p-4 rounded-xl border-[3px]" style={{ backgroundColor: "#e6fcf5", borderColor: "#96f2d7" }}>
          <p className="text-lg font-bold" style={{ color: "#0ca678" }}>Completed</p>
          <p className="text-3xl font-bold mt-1" style={{ color: "#0ca678" }}>{completed.length}</p>
        </div>
      </div>

      {/* ── Awaiting Booking Section ── */}
      <section className="mb-8">
        <h3 className="text-xl font-bold mb-3 flex items-center gap-2" style={{ color: "#4c6ef5" }}>
          <AlertCircle size={22} /> Awaiting Booking
          <span className="text-lg font-bold px-3 py-1 rounded-full" style={{ backgroundColor: "#4c6ef5", color: "#fff" }}>
            {awaiting.length}
          </span>
        </h3>
        {awaiting.length === 0 ? (
          <p className="text-lg font-bold py-6 text-center rounded-lg border-[3px] border-dashed"
            style={{ color: "var(--text3)", borderColor: "var(--border)" }}>
            No owners awaiting booking
          </p>
        ) : (
          <div className="space-y-3">
            {awaiting.map((c) => (
              <button key={c.id} onClick={() => setSelectedId(c.id)}
                className="w-full text-left p-4 rounded-lg border-[3px] transition-all hover:shadow-md"
                style={{ backgroundColor: "var(--surface)", borderColor: "#b8ccff" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold" style={{ color: "var(--text)" }}>
                      {c.owner?.full_name || "Unknown"}
                    </p>
                    <p className="text-lg font-bold" style={{ color: "var(--text2)" }}>
                      {c.owner?.property_address} · {c.scheduled_date}
                      {c.scheduled_time && ` at ${c.scheduled_time}`}
                    </p>
                  </div>
                  <Circle size={22} style={{ color: "#4c6ef5" }} />
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ── Scheduled Section ── */}
      <section className="mb-8">
        <h3 className="text-xl font-bold mb-3 flex items-center gap-2" style={{ color: "#f76707" }}>
          <Calendar size={22} /> Scheduled
          <span className="text-lg font-bold px-3 py-1 rounded-full" style={{ backgroundColor: "#f76707", color: "#fff" }}>
            {scheduled.length}
          </span>
        </h3>
        {scheduled.length === 0 ? (
          <p className="text-lg font-bold py-6 text-center rounded-lg border-[3px] border-dashed"
            style={{ color: "var(--text3)", borderColor: "var(--border)" }}>
            No check-ins scheduled yet
          </p>
        ) : (
          <div className="space-y-3">
            {scheduled.map((c) => {
              const cDate = new Date(c.scheduled_date + (c.scheduled_time ? "T" + c.scheduled_time : ""));
              const isSoon = cDate.getTime() - Date.now() < 24 * 60 * 60 * 1000;
              return (
                <button key={c.id} onClick={() => setSelectedId(c.id)}
                  className="w-full text-left p-4 rounded-lg border-[3px] transition-all hover:shadow-md"
                  style={{ backgroundColor: isSoon ? "#fff4e6" : "var(--surface)", borderColor: "#ffc078" }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold" style={{ color: "var(--text)" }}>
                        {c.owner?.full_name || "Unknown"}
                      </p>
                      <p className="text-lg font-bold" style={{ color: "var(--text2)" }}>
                        {c.owner?.property_address} · {c.scheduled_date}
                        {c.scheduled_time && ` at ${c.scheduled_time}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isSoon && (
                        <span className="text-lg font-bold px-2 py-1 rounded-lg border-[3px]"
                          style={{ backgroundColor: "#ffe3e3", borderColor: "#e03131", color: "#e03131" }}>
                          Soon
                        </span>
                      )}
                      <Clock size={22} style={{ color: "#f76707" }} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Completed Section ── */}
      <section>
        <h3 className="text-xl font-bold mb-3 flex items-center gap-2" style={{ color: "#0ca678" }}>
          <CheckCircle size={22} /> Completed & Historical
          <span className="text-lg font-bold px-3 py-1 rounded-full" style={{ backgroundColor: "#0ca678", color: "#fff" }}>
            {completed.length}
          </span>
        </h3>
        {completed.length === 0 ? (
          <p className="text-lg font-bold py-6 text-center rounded-lg border-[3px] border-dashed"
            style={{ color: "var(--text3)", borderColor: "var(--border)" }}>
            No completed check-ins yet
          </p>
        ) : (
          <div className="space-y-3">
            {completed.map((c) => (
              <button key={c.id} onClick={() => setSelectedId(c.id)}
                className="w-full text-left p-4 rounded-lg border-[3px] transition-all hover:shadow-md"
                style={{ backgroundColor: "var(--surface)", borderColor: "#96f2d7" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold" style={{ color: "var(--text)" }}>
                      {c.owner?.full_name || "Unknown"}
                      <span className="ml-2 text-lg font-bold px-2 py-1 rounded-lg border-[3px]" style={{
                        backgroundColor: c.status === "noshow" ? "#ffe3e3" : "#e6fcf5",
                        borderColor: c.status === "noshow" ? "#e03131" : "#0ca678",
                        color: c.status === "noshow" ? "#e03131" : "#0ca678",
                      }}>
                        {c.status === "noshow" ? "No-Show" : "Done"}
                      </span>
                    </p>
                    <p className="text-lg font-bold" style={{ color: "var(--text2)" }}>
                      {c.owner?.property_address} · {c.scheduled_date}
                    </p>
                    {c.combined_summary && (
                      <p className="text-lg mt-1 line-clamp-2" style={{ color: "var(--text3)" }}>
                        {c.combined_summary.slice(0, 120)}...
                      </p>
                    )}
                  </div>
                  <CheckCircle size={22} style={{ color: "#0ca678" }} />
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Modals */}
      {showAdd && <AddCheckinModal onClose={() => setShowAdd(false)} onCreated={(c) => setCheckins((prev) => [{ ...c, owner: c.owner || {} }, ...prev])} />}
      {selectedCheckin && (
        <CheckinSlideover
          checkin={selectedCheckin}
          onClose={() => setSelectedId(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}
