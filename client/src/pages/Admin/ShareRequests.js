import React, { useContext, useEffect, useMemo, useState } from "react";
import { AdminAuthContext } from "../../contexts/AdminAuthContext";
import { api } from "../../services/api";

export default function ShareRequests() {
  const { token } = useContext(AdminAuthContext);
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const [rows, setRows] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDesc] = useState("");
  const [display_order, setOrder] = useState(1);
  const [is_active, setActive] = useState(true);

  const load = async () => {
    const r = await api.get("/admin/share-requests", { headers });
    setRows(r.data.rows || []);
  };

  useEffect(() => { load().catch(() => {}); }, []);

  const create = async () => {
    if (!title.trim()) return alert("Title required");
    await api.post("/admin/share-requests", { title, description, display_order, is_active }, { headers });
    setTitle(""); setDesc(""); setOrder(1); setActive(true);
    await load();
  };

  const toggleActive = async (r) => {
    await api.put(`/admin/share-requests/${r.id}`, { is_active: !r.is_active }, { headers });
    await load();
  };

  const remove = async (r) => {
    if (!window.confirm("Delete this request?")) return;
    await api.delete(`/admin/share-requests/${r.id}`, { headers });
    await load();
  };

  return (
    <div className="card">
      <div className="sectionTitleSmall">Share Request Manager</div>

      <div className="grid2">
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title..." />
        <input className="input" type="number" value={display_order} onChange={(e) => setOrder(Number(e.target.value || 1))} placeholder="Order" />
      </div>

      <textarea className="textarea" value={description} onChange={(e) => setDesc(e.target.value)} placeholder="Description (optional)..." />

      <div className="row" style={{ gap: 10 }}>
        <label className="muted">
          <input type="checkbox" checked={is_active} onChange={(e) => setActive(e.target.checked)} /> Set Active
        </label>
        <button className="btn primary" onClick={create}>Create</button>
      </div>

      <div className="spacer" />

      <div className="table wide">
        <div className="tHead shareReqHead">
          <div>ID</div><div>Title</div><div>Order</div><div>Active</div><div>Action</div>
        </div>

        {rows.map((r) => (
          <div className="tRow shareReqRow" key={r.id}>
            <div>{r.id}</div>
            <div className="wrap">{r.title}</div>
            <div>{r.display_order}</div>
            <div>{r.is_active ? "YES" : "NO"}</div>
            <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
              <button className="btn" onClick={() => toggleActive(r)}>{r.is_active ? "Deactivate" : "Activate"}</button>
              <button className="btn danger" onClick={() => remove(r)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
