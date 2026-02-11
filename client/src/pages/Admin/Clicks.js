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

export default function Clicks() {
  const { token } = useContext(AdminAuthContext);
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState({}); // {id:true}
  const selectedIds = Object.keys(selected).filter((k) => selected[k]).map(Number);

  const [page, setPage] = useState(1);
  const [totalPages, setTP] = useState(1);

  const [q, setQ] = useState("");
  const [session, setSession] = useState("");
  const [type, setType] = useState("");
  const [label, setLabel] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);

  const load = async (p = 1) => {
    const params = new URLSearchParams({
      page: String(p),
      limit: "25",
      q, session, type, label, from, to
    });
    const r = await api.get(`/admin/clicks?${params.toString()}`, { headers });
    setRows(r.data.rows || []);
    setPage(r.data.page || 1);
    setTP(r.data.totalPages || 1);
    setSelected({});
  };

  useEffect(() => { load(1).catch(() => {}); }, []);

  const applyFilters = () => load(1);
  const clearFilters = () => {
    setQ(""); setSession(""); setType(""); setLabel(""); setFrom(""); setTo("");
    setTimeout(() => load(1), 0);
  };

  const toggleRow = (id) => setSelected((s) => ({ ...s, [id]: !s[id] }));

  const allOnPageChecked = rows.length && rows.every((r) => selected[r.id]);
  const toggleAllOnPage = () => {
    if (allOnPageChecked) {
      const copy = { ...selected };
      rows.forEach((r) => delete copy[r.id]);
      setSelected(copy);
      return;
    }
    const copy = { ...selected };
    rows.forEach((r) => (copy[r.id] = true));
    setSelected(copy);
  };

  const openRow = (r) => {
    setActive(r);
    setOpen(true);
  };

  const deleteSelected = async () => {
    if (!selectedIds.length) return alert("Select rows first.");
    if (!window.confirm(`Delete ${selectedIds.length} selected clicks?`)) return;
    await api.delete("/admin/clicks", { headers, data: { ids: selectedIds } });
    await load(page);
  };

  const deleteAll = async () => {
    const ok = window.prompt('Type DELETE ALL to confirm deleting ALL button clicks:');
    if (ok !== "DELETE ALL") return;
    await api.delete("/admin/clicks", { headers, data: { deleteAll: true } });
    await load(1);
  };

  const exportCSV = async () => {
    const res = await api.get("/admin/export/clicks.csv", { headers, responseType: "blob" });
    downloadBlob(res.data, "button_clicks.csv");
  };

  return (
    <div className="card">
      <div className="sectionTitleSmall">Button Clicks Manager</div>

      <div className="filterBar clicksBar">
        <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search: label/type/selector/url..." />
        <input className="input" value={session} onChange={(e) => setSession(e.target.value)} placeholder="Session contains..." />
        <input className="input" value={type} onChange={(e) => setType(e.target.value)} placeholder="Type (exact)" />
        <input className="input" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label (exact)" />
        <input className="input" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        <input className="input" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        <button className="btn" onClick={applyFilters}>Apply</button>
        <button className="btn" onClick={clearFilters}>Clear</button>
      </div>

      <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
        <button className="btn primary" onClick={exportCSV}>Export CSV</button>
        <button className="btn" disabled={!selectedIds.length} onClick={deleteSelected}>
          Delete Selected ({selectedIds.length})
        </button>
        <button className="btn danger" onClick={deleteAll}>Delete ALL</button>
      </div>

      <div className="table wide">
        <div className="tHead clicksHead">
          <div>
            <input type="checkbox" checked={!!allOnPageChecked} onChange={toggleAllOnPage} />
          </div>
          <div>ID</div>
          <div>Session</div>
          <div>Type</div>
          <div>Label</div>
          <div>X/Y</div>
          <div>Page</div>
          <div>Time</div>
          <div>Action</div>
        </div>

        {rows.map((r) => (
          <div className="tRow clicksRow" key={r.id}>
            <div>
              <input type="checkbox" checked={!!selected[r.id]} onChange={() => toggleRow(r.id)} />
            </div>
            <div>{r.id}</div>
            <div className="wrap mono">{r.session_id}</div>
            <div>{r.type || "—"}</div>
            <div className="wrap">{r.label || "—"}</div>
            <div>{(r.x ?? "—") + " / " + (r.y ?? "—")}</div>
            <div className="wrap">{(r.page_url || "").slice(0, 40)}{(r.page_url || "").length > 40 ? "..." : ""}</div>
            <div className="wrap">{new Date(r.createdAt).toLocaleString()}</div>
            <div><button className="btn" onClick={() => openRow(r)}>View</button></div>
          </div>
        ))}

        {!rows.length ? <div className="muted">No button clicks found</div> : null}
      </div>

      <div className="pager">
        <button className="btn" disabled={page <= 1} onClick={() => load(page - 1)}>Prev</button>
        <div className="muted">Page {page} / {totalPages}</div>
        <button className="btn" disabled={page >= totalPages} onClick={() => load(page + 1)}>Next</button>
      </div>

      <Modal
        open={open}
        title={`Button Click #${active?.id || ""}`}
        onClose={() => setOpen(false)}
      >
        <div className="modalGrid">
          <div><span className="muted">Session</span><div className="mono">{active?.session_id}</div></div>
          <div><span className="muted">Type</span><div>{active?.type || "—"}</div></div>
          <div><span className="muted">Label</span><div>{active?.label || "—"}</div></div>
          <div><span className="muted">Coordinates</span><div>{active?.x ?? "—"} / {active?.y ?? "—"}</div></div>
          <div><span className="muted">Selector</span><div className="wrap">{active?.selector || "—"}</div></div>
          <div><span className="muted">Page URL</span><div className="wrap">{active?.page_url || "—"}</div></div>
          <div><span className="muted">Time</span><div>{active?.createdAt ? new Date(active.createdAt).toLocaleString() : "—"}</div></div>
        </div>
      </Modal>
    </div>
  );
}
