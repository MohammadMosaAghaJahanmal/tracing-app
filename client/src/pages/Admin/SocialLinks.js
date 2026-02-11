import React, { useContext, useEffect, useState } from "react";
import { AdminAuthContext } from "../../contexts/AdminAuthContext";
import { api } from "../../services/api";

export default function SocialLinks() {
  const { token } = useContext(AdminAuthContext);
  const headers = { Authorization: `Bearer ${token}` };

  const [rows, setRows] = useState([]);
  const [platform, setPlatform] = useState("Instagram");
  const [url, setUrl] = useState("");
  const [description, setDesc] = useState("");
  const [display_order, setOrder] = useState(1);
  const [msg, setMsg] = useState("");

  const load = async () => {
    const r = await api.get("/admin/social-links", { headers });
    setRows(r.data.rows || []);
  };
  useEffect(() => { load().catch(() => {}); }, []);

  const add = async () => {
    setMsg("Saving...");
    await api.post("/admin/social-links", { platform, url, description, display_order, is_active: true }, { headers });
    setUrl("");
    setDesc("");
    setOrder(1);
    await load();
    setMsg("Saved ✓");
  };

  const del = async (row) => {
    await api.delete(`/admin/social-links/${row.id}`, { headers });
    await load();
  };

  const toggle = async (row) => {
    await api.put(`/admin/social-links/${row.id}`, { is_active: !row.is_active }, { headers });
    await load();
  };

  return (
    <div className="card">
      <div className="sectionTitleSmall">Social Link Manager</div>

      <div className="formRow">
        <input className="input" value={platform} onChange={(e) => setPlatform(e.target.value)} placeholder="Platform (Instagram)" />
        <input className="input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL" />
      </div>

      <div className="formRow">
        <input className="input" value={description} onChange={(e) => setDesc(e.target.value)} placeholder="Description (optional)" />
        <input className="input" type="number" value={display_order} onChange={(e) => setOrder(Number(e.target.value))} />
        <button className="btn primary" onClick={add}>Add</button>
        <div className="hint">{msg}</div>
      </div>

      <div className="table">
        <div className="tHead">
          <div>ID</div><div>Platform</div><div>URL</div><div>Order</div><div>Active</div><div>Actions</div>
        </div>
        {rows.map((r) => (
          <div className="tRow" key={r.id}>
            <div>{r.id}</div>
            <div>{r.platform}</div>
            <div className="wrap">{r.url}</div>
            <div>{r.display_order}</div>
            <div>{r.is_active ? "Yes" : "No"}</div>
            <div className="actions">
              <button className="btn" onClick={() => toggle(r)}>{r.is_active ? "Disable" : "Enable"}</button>
              <button className="btn danger" onClick={() => del(r)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
