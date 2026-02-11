import React, { useContext, useEffect, useState } from "react";
import { AdminAuthContext } from "../../contexts/AdminAuthContext";
import { api } from "../../services/api";

export default function Questions() {
  const { token } = useContext(AdminAuthContext);
  const [rows, setRows] = useState([]);
  const [text, setText] = useState("");
  const [display_order, setOrder] = useState(1);
  const [is_active, setActive] = useState(true);
  const [msg, setMsg] = useState("");

  const headers = { Authorization: `Bearer ${token}` };

  const load = async () => {
    const r = await api.get("/admin/questions", { headers });
    setRows(r.data.rows || []);
  };

  useEffect(() => { load().catch(() => {}); }, []);

  const add = async () => {
    setMsg("Saving...");
    await api.post("/admin/questions", { text, display_order, is_active }, { headers });
    setText("");
    setOrder(1);
    setActive(true);
    await load();
    setMsg("Saved ✓");
  };

  const toggle = async (row) => {
    await api.put(`/admin/questions/${row.id}`, { is_active: !row.is_active }, { headers });
    await load();
  };

  const del = async (row) => {
    await api.delete(`/admin/questions/${row.id}`, { headers });
    await load();
  };

  return (
    <div className="card">
      <div className="sectionTitleSmall">Question Manager</div>

      <div className="formRow">
        <textarea className="textarea" value={text} onChange={(e) => setText(e.target.value)} placeholder="Question text..." />
      </div>

      <div className="formRow">
        <label className="label">Display Order</label>
        <input className="input" type="number" value={display_order} onChange={(e) => setOrder(Number(e.target.value))} />
        <label className="label">Active</label>
        <input type="checkbox" checked={is_active} onChange={(e) => setActive(e.target.checked)} />
        <button className="btn primary" onClick={add}>Add</button>
        <div className="hint">{msg}</div>
      </div>

      <div className="table">
        <div className="tHead">
          <div>ID</div><div>Text</div><div>Order</div><div>Active</div><div>Actions</div>
        </div>
        {rows.map((r) => (
          <div className="tRow" key={r.id}>
            <div>{r.id}</div>
            <div className="wrap">{r.text}</div>
            <div>{r.display_order}</div>
            <div>{r.is_active ? "Yes" : "No"}</div>
            <div className="actions">
              <button className="btn" onClick={() => toggle(r)}>{r.is_active ? "Disable" : "Enable"}</button>
              <button className="btn danger" onClick={() => del(r)}>Delete</button>
            </div>
          </div>
        ))}
        {!rows.length ? <div className="muted">No questions</div> : null}
      </div>
    </div>
  );
}
