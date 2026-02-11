import React, { useContext, useEffect, useMemo, useState } from "react";
import { AdminAuthContext } from "../../contexts/AdminAuthContext";
import { api } from "../../services/api";
import Modal from "../../components/UI/Modal";

const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

export default function LiveText() {
  const { token } = useContext(AdminAuthContext);
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTP] = useState(1);

  const [q, setQ] = useState("");
  const [field, setField] = useState("");
  const [reviewed, setReviewed] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [notes, setNotes] = useState("");
  const [msg, setMsg] = useState("");

  const load = async (p = 1) => {
    const params = new URLSearchParams({
      page: String(p),
      limit: "20",
      q,
      field,
      reviewed,
      from,
      to
    });
    const r = await api.get(`/admin/live-text?${params.toString()}`, { headers });
    setRows(r.data.rows || []);
    setPage(r.data.page || 1);
    setTP(r.data.totalPages || 1);
  };

  useEffect(() => {
    load(1).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyFilters = () => load(1);
  const clearFilters = () => {
    setQ("");
    setField("");
    setReviewed("");
    setFrom("");
    setTo("");
    setTimeout(() => load(1), 0);
  };

  const openRow = (r) => {
    setActive(r);
    setNotes(r.admin_notes || "");
    setOpen(true);
    setMsg("");
  };

  const saveReview = async (is_reviewed) => {
    if (!active) return;
    setMsg("Saving...");
    const r = await api.put(`/admin/live-text/${active.id}`, { is_reviewed, admin_notes: notes }, { headers });
    setMsg("Saved ✓");
    setActive(r.data.row);
    await load(page);
  };

  const remove = async () => {
    if (!active) return;
    if (!window.confirm("Delete this live text entry?")) return;
    await api.delete(`/admin/live-text/${active.id}`, { headers });
    setOpen(false);
    await load(page);
  };

  const exportCSV = async () => {
    const res = await api.get("/admin/export/live_text.csv", { headers, responseType: "blob" });
    downloadBlob(res.data, "live_text.csv");
  };

  return (
    <div className="card">
      <div className="sectionTitleSmall">Live Text Manager (Autosaves)</div>

      <div className="filterBar">
        <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search: session / content..." />
        <input className="input" value={field} onChange={(e) => setField(e.target.value)} placeholder="Field key (optional)" />
        <select className="input" value={reviewed} onChange={(e) => setReviewed(e.target.value)}>
          <option value="">All</option>
          <option value="false">Unreviewed</option>
          <option value="true">Reviewed</option>
        </select>
        <input className="input" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        <input className="input" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        <button className="btn" onClick={applyFilters}>Apply</button>
        <button className="btn" onClick={clearFilters}>Clear</button>
        <button className="btn primary" onClick={exportCSV}>Export CSV</button>
      </div>

      <div className="table wide">
        <div className="tHead liveHead">
          <div>ID</div>
          <div>Session</div>
          <div>Field</div>
          <div>Ver</div>
          <div>Keys</div>
          <div>Speed</div>
          <div>Reviewed</div>
          <div>Time</div>
          <div>Action</div>
        </div>

        {rows.map((r) => (
          <div className="tRow liveRow" key={r.id}>
            <div>{r.id}</div>
            <div className="wrap mono">{r.session_id}</div>
            <div>{r.field_key}</div>
            <div>{r.version}</div>
            <div>{r.keystrokes ?? "—"}</div>
            <div>{r.typing_speed_kpm ?? "—"}</div>
            <div>
              <span className={"pill " + (r.is_reviewed ? "ok" : "warn")}>
                {r.is_reviewed ? "Reviewed" : "Unreviewed"}
              </span>
            </div>
            <div className="wrap">{new Date(r.createdAt).toLocaleString()}</div>
            <div><button className="btn" onClick={() => openRow(r)}>View</button></div>
          </div>
        ))}

        {!rows.length ? <div className="muted">No live text found</div> : null}
      </div>

      <div className="pager">
        <button className="btn" disabled={page <= 1} onClick={() => load(page - 1)}>Prev</button>
        <div className="muted">Page {page} / {totalPages}</div>
        <button className="btn" disabled={page >= totalPages} onClick={() => load(page + 1)}>Next</button>
      </div>

      <Modal
        open={open}
        title={`Live Text #${active?.id || ""}`}
        onClose={() => setOpen(false)}
        actions={
          <div className="modalActionsRow">
            <button className="btn" onClick={() => saveReview(false)}>Mark Unreviewed</button>
            <button className="btn primary" onClick={() => saveReview(true)}>Mark Reviewed</button>
            <button className="btn danger" onClick={remove}>Delete</button>
          </div>
        }
      >
        <div className="modalGrid">
          <div><span className="muted">Session</span><div className="mono">{active?.session_id}</div></div>
          <div><span className="muted">Field / Ver</span><div>{active?.field_key} / {active?.version}</div></div>
          <div><span className="muted">Keys / Speed</span><div>{active?.keystrokes ?? "—"} / {active?.typing_speed_kpm ?? "—"}</div></div>
          <div><span className="muted">Duration</span><div>{active?.typing_duration_ms ?? "—"} ms</div></div>
          <div><span className="muted">Time</span><div>{active?.createdAt ? new Date(active.createdAt).toLocaleString() : "—"}</div></div>
        </div>

        <div className="spacer" />

        <div className="muted">Content</div>
        <div className="box pre">{active?.content || "—"}</div>

        <div className="spacer" />

        <div className="muted">Admin Notes</div>
        <textarea className="textarea" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Write notes..." />

        <div className="hint">{msg}</div>
      </Modal>
    </div>
  );
}
