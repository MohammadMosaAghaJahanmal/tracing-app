import React, { useContext, useEffect, useState } from "react";
import { AdminAuthContext } from "../../contexts/AdminAuthContext";
import { api } from "../../services/api";

export default function TrackingData() {
  const { token } = useContext(AdminAuthContext);
  const headers = { Authorization: `Bearer ${token}` };
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTP] = useState(1);

  const load = async (p) => {
    const r = await api.get(`/admin/tracking?page=${p}&limit=20`, { headers });
    setRows(r.data.rows || []);
    setPage(r.data.page || 1);
    setTP(r.data.totalPages || 1);
  };

  useEffect(() => { load(1).catch(() => {}); }, []);

  const exportCSV = async () => {
    const res = await api.get("/admin/export/tracking.csv", {
      headers,
      responseType: "blob"
    });

    const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "tracking.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="card">
      <div className="sectionTitleSmall">User Tracking Data</div>

      <div className="row">
        <button className="btn" onClick={exportCSV}>Export CSV</button>
      </div>

<div className="table wide">
  <div className="tHead trackHead">
    <div>Session</div>
    <div>IP</div>
    <div>City</div>
    <div>Region</div>
    <div>Country</div>
    <div>Lat</div>
    <div>Long</div>
    <div>OS</div>
    <div>Browser</div>
    <div>Device</div>
    <div>Time</div>
  </div>

  {rows.map((r) => (
    <div className="tRow trackRow" key={r.id}>
      <div className="wrap">{r.session_id}</div>
      <div>{r.ip || "—"}</div>
      <div>{r.city || "—"}</div>
      <div>{r.region || "—"}</div>
      <div>{r.country || "—"}</div>
      <div>{r.latitude ?? "—"}</div>
      <div>{r.longitude ?? "—"}</div>
      <div>{r.os || "—"}</div>
      <div>{r.browser || "—"}</div>
      <div>{r.device || "—"}</div>
      <div className="wrap">{new Date(r.createdAt).toLocaleString()}</div>
    </div>
  ))}
</div>


      <div className="pager">
        <button className="btn" disabled={page <= 1} onClick={() => load(page - 1)}>Prev</button>
        <div className="muted">Page {page} / {totalPages}</div>
        <button className="btn" disabled={page >= totalPages} onClick={() => load(page + 1)}>Next</button>
      </div>
    </div>
  );
}
