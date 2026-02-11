import React, { useContext, useEffect, useState } from "react";
import { AdminAuthContext } from "../../contexts/AdminAuthContext";
import { api } from "../../services/api";

export default function Stories() {
  const { token } = useContext(AdminAuthContext);
  const headers = { Authorization: `Bearer ${token}` };

  const [rows, setRows] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [author, setAuthor] = useState("Mosa");
  const [display_order, setOrder] = useState(1);
  const [is_published, setPub] = useState(true);
  const [content_html, setHtml] = useState("<p>Write story here...</p>");
  const [msg, setMsg] = useState("");

  const load = async () => {
    const r = await api.get("/admin/stories", { headers });
    setRows(r.data.rows || []);
  };
  useEffect(() => { load().catch(() => {}); }, []);

  const add = async () => {
    setMsg("Saving...");
    await api.post("/admin/stories", { title, category, author, display_order, is_published, content_html }, { headers });
    setTitle("");
    setHtml("<p>Write story here...</p>");
    await load();
    setMsg("Saved ✓");
  };

  const del = async (row) => {
    await api.delete(`/admin/stories/${row.id}`, { headers });
    await load();
  };

  const toggle = async (row) => {
    await api.put(`/admin/stories/${row.id}`, { is_published: !row.is_published }, { headers });
    await load();
  };

  return (
    <div className="card">
      <div className="sectionTitleSmall">Story / Content Manager</div>

      <div className="formRow">
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <input className="input" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
        <input className="input" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" />
      </div>

      <div className="formRow">
        <label className="label">Order</label>
        <input className="input" type="number" value={display_order} onChange={(e) => setOrder(Number(e.target.value))} />
        <label className="label">Published</label>
        <input type="checkbox" checked={is_published} onChange={(e) => setPub(e.target.checked)} />
        <button className="btn primary" onClick={add}>Add</button>
        <div className="hint">{msg}</div>
      </div>

      <div className="formRow">
        <textarea className="textarea" value={content_html} onChange={(e) => setHtml(e.target.value)} style={{ minHeight: 180 }} />
      </div>

      <div className="table">
        <div className="tHead">
          <div>ID</div><div>Title</div><div>Category</div><div>Read</div><div>Published</div><div>Actions</div>
        </div>
        {rows.map((r) => (
          <div className="tRow" key={r.id}>
            <div>{r.id}</div>
            <div className="wrap">{r.title}</div>
            <div>{r.category}</div>
            <div>{r.read_time_min}m</div>
            <div>{r.is_published ? "Yes" : "No"}</div>
            <div className="actions">
              <button className="btn" onClick={() => toggle(r)}>{r.is_published ? "Unpublish" : "Publish"}</button>
              <button className="btn danger" onClick={() => del(r)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
