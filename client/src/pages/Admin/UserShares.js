import React, { useContext, useEffect, useMemo, useState } from "react";
import { AdminAuthContext } from "../../contexts/AdminAuthContext";
import { api } from "../../services/api";

export default function UserShares() {
  const { token } = useContext(AdminAuthContext);
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState({});
  const selectedIds = Object.keys(selected).filter((k) => selected[k]).map(Number);

  const [page, setPage] = useState(1);
  const [totalPages, setTP] = useState(1);
  const [q, setQ] = useState("");

  const API_BASE = process.env.REACT_APP_API_BASE;

  const load = async (p = 1) => {
    const params = new URLSearchParams({ page: String(p), limit: "10", q });
    const r = await api.get(`/admin/user-shares?${params.toString()}`, { headers });
    setRows(r.data.rows || []);
    setPage(r.data.page || 1);
    setTP(r.data.totalPages || 1);
    setSelected({});
  };

  useEffect(() => { load(1).catch(() => {}); }, []);

  const toggle = (id) => setSelected((s) => ({ ...s, [id]: !s[id] }));

  const delSelected = async () => {
    if (!selectedIds.length) return alert("Select entries first.");
    if (!window.confirm(`Delete ${selectedIds.length} entries?`)) return;
    await api.delete("/admin/user-shares", { headers, data: { ids: selectedIds } });
    await load(page);
  };

  const delAll = async () => {
    const ok = window.prompt('Type DELETE ALL to delete ALL user shares:');
    if (ok !== "DELETE ALL") return;
    await api.delete("/admin/user-shares", { headers, data: { deleteAll: true } });
    await load(1);
  };

  const delOne = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    await api.delete(`/admin/user-shares/${id}`, { headers });
    await load(page);
  };

  return (
    <div className="card">
      <div className="sectionTitleSmall">User Shared Files</div>

      <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
        <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search session/title/message..." />
        <button className="btn" onClick={() => load(1)}>Search</button>
        <button className="btn" onClick={() => { setQ(""); setTimeout(() => load(1), 0); }}>Clear</button>
        <button className="btn" disabled={!selectedIds.length} onClick={delSelected}>Delete Selected ({selectedIds.length})</button>
        <button className="btn danger" onClick={delAll}>Delete ALL</button>
      </div>

      <div className="spacer" />

      {rows.map((r) => (
        <div key={r.id} className="shareItem">
          <div className="row" style={{ justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
            <div className="row" style={{ gap: 10 }}>
              <input type="checkbox" checked={!!selected[r.id]} onChange={() => toggle(r.id)} />
              <div>
                <div className="muted">Title</div>
                <div className="wrap">{r.title_snapshot || "—"}</div>
              </div>
              <div>
                <div className="muted">Session</div>
                <div className="mono wrap">{r.session_id}</div>
              </div>
              <div>
                <div className="muted">Files</div>
                <div>{r.file_count}</div>
              </div>
              <div>
                <div className="muted">Time</div>
                <div className="wrap">{new Date(r.createdAt).toLocaleString()}</div>
              </div>
            </div>

            <button className="btn danger" onClick={() => delOne(r.id)}>Delete</button>
          </div>

          {r.message ? (
            <div className="box pre" style={{ marginTop: 10 }}>
              {r.message}
            </div>
          ) : null}

          <div className="shareFiles">
            {(r.files || []).map((f) => {
              const url = API_BASE + f.file_url;
              const isImg = (f.mime_type || "").startsWith("image/");
              const isVid = (f.mime_type || "").startsWith("video/");
              return (
                <div className="fileCard" key={f.id}>
                  <div className="muted wrap">{f.original_name}</div>

                  {isImg ? <img src={url} alt="" className="preview" /> : null}
                  {isVid ? <video src={url} className="preview" controls /> : null}

                  <a className="btn" href={url} target="_blank" rel="noreferrer">Open</a>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="pager">
        <button className="btn" disabled={page <= 1} onClick={() => load(page - 1)}>Prev</button>
        <div className="muted">Page {page} / {totalPages}</div>
        <button className="btn" disabled={page >= totalPages} onClick={() => load(page + 1)}>Next</button>
      </div>
    </div>
  );
}
