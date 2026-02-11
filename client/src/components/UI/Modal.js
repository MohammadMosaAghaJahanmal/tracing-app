import React from "react";

export default function Modal({ open, title, onClose, children, actions }) {
  if (!open) return null;
  return (
    <div className="modalBack" onMouseDown={onClose}>
      <div className="modalCard" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modalTop">
          <div className="modalTitle">{title}</div>
          <button className="btn ghost" onClick={onClose}>✕</button>
        </div>
        <div className="modalBody">{children}</div>
        {actions ? <div className="modalActions">{actions}</div> : null}
      </div>
    </div>
  );
}
