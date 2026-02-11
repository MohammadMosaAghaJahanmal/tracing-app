import React, { useContext, useEffect, useState } from "react";
import { AdminAuthContext } from "../../contexts/AdminAuthContext";
import { api } from "../../services/api";

export default function SliderImages() {
  const { token } = useContext(AdminAuthContext);
  const headers = { Authorization: `Bearer ${token}` };
  const [rows, setRows] = useState([]);
  const [msg, setMsg] = useState("");

  const [group_index, setGroup] = useState(1);
  const [display_order, setOrder] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDesc] = useState("");
  const [images, setImages] = useState([]);

  const load = async () => {
    const r = await api.get("/admin/slider-images", { headers });
    setRows(r.data.rows || []);
  };

  useEffect(() => { load().catch(() => {}); }, []);

  const upload = async () => {
    if (!images.length) return;
    setMsg("Uploading...");
    const fd = new FormData();
    for (const f of images) fd.append("images", f);
    fd.append("group_index", group_index);
    fd.append("display_order", display_order);
    fd.append("title", title);
    fd.append("description", description);
    fd.append("is_active", "true");

    await api.post("/admin/slider-images/upload", fd, { headers, headers: { ...headers, "Content-Type": "multipart/form-data" } });
    setImages([]);
    setTitle("");
    setDesc("");
    await load();
    setMsg("Uploaded ✓");
  };

  const del = async (row) => {
    await api.delete(`/admin/slider-images/${row.id}`, { headers });
    await load();
  };

  const toggle = async (row) => {
    await api.put(`/admin/slider-images/${row.id}`, { is_active: !row.is_active }, { headers });
    await load();
  };

  return (
    <div className="card">
      <div className="sectionTitleSmall">Slider Image Manager</div>

      <div className="formRow">
        <label className="label">Group Index (2 images per slide)</label>
        <input className="input" type="number" value={group_index} onChange={(e) => setGroup(Number(e.target.value))} />
        <label className="label">Display Order</label>
        <input className="input" type="number" value={display_order} onChange={(e) => setOrder(Number(e.target.value))} />
      </div>

      <div className="formRow">
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (optional)" />
        <input className="input" value={description} onChange={(e) => setDesc(e.target.value)} placeholder="Description (optional)" />
      </div>

      <div className="formRow">
        <input className="input" type="file" multiple accept="image/*" onChange={(e) => setImages(Array.from(e.target.files || []))} />
        <button className="btn primary" onClick={upload}>Upload</button>
        <div className="hint">{msg}</div>
      </div>

      <div className="table">
        <div className="tHead">
          <div>ID</div><div>Preview</div><div>Group</div><div>Order</div><div>Active</div><div>Actions</div>
        </div>
        {rows.map((r) => (
          <div className="tRow" key={r.id}>
            <div>{r.id}</div>
            <div>
              <img alt="img" className="miniImg" src={process.env.REACT_APP_API_BASE + r.image_url} />
            </div>
            <div>{r.group_index}</div>
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
