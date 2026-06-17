"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

const ORG_ID = "d1000000-0000-0000-0000-000000000001";

interface Deal {
  id: string;
  address: string;
  client_name: string;
  agent: string;
  stage_idx: number;
  price: number;
  type: string;
  status: string;
}

function AddDealModal({ onClose, onCreated }: { onClose: () => void; onCreated: (d: Deal) => void }) {
  const [address, setAddress] = useState("");
  const [clientName, setClientName] = useState("");
  const [agent, setAgent] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("sale");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!address.trim() || !clientName.trim() || !agent.trim()) {
      setError("Address, client name, and agent are required.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-org-id": ORG_ID },
        body: JSON.stringify({
          address: address.trim(),
          client_name: clientName.trim(),
          agent: agent.trim(),
          price: price ? Number(price) : null,
          type,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      onCreated(json.data);
      onClose();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} onClick={onClose}>
      <div
        className="rounded-xl p-6 w-full max-w-md"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold" style={{ color: "var(--text)", fontFamily: "Instrument Serif, serif" }}>
            Add Deal
          </h3>
          <button onClick={onClose} style={{ color: "var(--text3)" }}><X size={18} /></button>
        </div>

        <div className="space-y-3">
          <input
            className="w-full rounded-lg px-3 py-2.5 text-sm border"
            style={{ backgroundColor: "var(--bg)", color: "var(--text)", borderColor: "var(--border)" }}
            placeholder="Address *"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            className="w-full rounded-lg px-3 py-2.5 text-sm border"
            style={{ backgroundColor: "var(--bg)", color: "var(--text)", borderColor: "var(--border)" }}
            placeholder="Client name *"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
          <input
            className="w-full rounded-lg px-3 py-2.5 text-sm border"
            style={{ backgroundColor: "var(--bg)", color: "var(--text)", borderColor: "var(--border)" }}
            placeholder="Agent *"
            value={agent}
            onChange={(e) => setAgent(e.target.value)}
          />
          <div className="flex gap-3">
            <input
              className="flex-1 rounded-lg px-3 py-2.5 text-sm border"
              style={{ backgroundColor: "var(--bg)", color: "var(--text)", borderColor: "var(--border)" }}
              placeholder="Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <select
              className="flex-1 rounded-lg px-3 py-2.5 text-sm border"
              style={{ backgroundColor: "var(--bg)", color: "var(--text)", borderColor: "var(--border)" }}
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="sale">Sale</option>
              <option value="lease">Lease</option>
            </select>
          </div>
        </div>

        {error && <p className="text-xs mt-3" style={{ color: "var(--high)" }}>{error}</p>}

        <button
          className="w-full mt-4 rounded-lg py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
          onClick={submit}
          disabled={submitting}
        >
          {submitting ? "Creating..." : "Create Deal"}
        </button>
      </div>
    </div>
  );
}

export default function PipelineClient({ initialDeals }: { initialDeals: any[] }) {
  const [deals, setDeals] = useState(initialDeals);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="px-4 sm:px-6 pt-4 pb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg" style={{ fontFamily: "Instrument Serif, serif", color: "var(--text)" }}>
          Pipeline · {deals.length} deals
        </h2>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
        >
          <Plus size={14} /> Add Deal
        </button>
      </div>

      {deals.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--text3)" }}>No deals in pipeline yet.</p>
      ) : (
        <div className="space-y-2">
          {deals.map((d: any) => (
            <div
              key={d.id}
              className="rounded-lg p-4 flex items-center gap-4"
              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{d.address}</p>
                <p className="text-xs" style={{ color: "var(--text3)" }}>{d.client_name} · {d.agent} · {d.type}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--surface3)", color: "var(--text2)", fontFamily: "DM Mono, monospace" }}>
                  {d.status} · stage {d.stage_idx}
                </span>
                {d.price && (
                  <p className="text-xs mt-1 font-medium" style={{ color: "var(--accent)", fontFamily: "DM Mono, monospace" }}>
                    ${Number(d.price).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && <AddDealModal onClose={() => setShowAdd(false)} onCreated={(d) => setDeals((prev) => [d, ...prev])} />}
    </div>
  );
}
