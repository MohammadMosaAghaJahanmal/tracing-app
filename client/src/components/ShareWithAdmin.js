import React, { useEffect, useState } from "react";
import { getShareRequest, uploadShare } from "../services/shareApi";
import { getSessionId } from "../utils/tracking";

export default function ShareWithAdmin() {
  const [reqRow, setReqRow] = useState(null);
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("");

  const load = async () => {
    const r = await getShareRequest();
    setReqRow(r.data.row);
  };

  useEffect(() => { load().catch(() => {}); }, []);

  if (!reqRow) return null;

  const onPick = (e) => {
    const list = Array.from(e.target.files || []);
    setFiles(list);
  };

  const submit = async () => {
    if (!files.length) return alert("Please select at least 1 file.");
    setStatus("Uploading...");

    const fd = new FormData();
    fd.append("session_id", getSessionId());
    fd.append("share_request_id", String(reqRow.id));
    fd.append("message", message);

    files.forEach((f) => fd.append("files", f));

    await uploadShare(fd);

    setStatus("Uploaded ✓ Thank you!");
    setMessage("");
    setFiles([]);
  };

  return (
    <div className="card shareCard">
      <div className="sectionTitleSmall">{reqRow.title}</div>
      {reqRow.description ? <div className="muted">{reqRow.description}</div> : null}

      <div className="spacer" />

      <textarea
        className="textarea"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write a message (optional)..."
      />

      <div className="spacer" />

      <input
        className="input"
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={onPick}
      />

      {files.length ? <div className="muted">Selected files: {files.length}</div> : null}

      <div className="spacer" />

      <button className="btn primary" onClick={submit}>Send to Admin</button>
      <div className="hint">{status}</div>
    </div>
  );
}
