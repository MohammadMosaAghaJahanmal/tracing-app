import React, { useState } from "react";

export default function Stories({ stories }) {
  const arr = Array.isArray(stories) ? stories : [];
  const [openId, setOpenId] = useState(null);

  return (
    <div className="stories">
      {arr.length === 0 ? (
        <div className="card muted">No stories. Add in Admin.</div>
      ) : (
        arr.map((s) => {
          const open = openId === s.id;
          return (
            <div className="card story" key={s.id}>
              <div className="storyTop" onClick={() => setOpenId(open ? null : s.id)} role="button" tabIndex={0}>
                <div>
                  <div className="storyTitle">{s.title}</div>
                  <div className="storyMeta">
                    {s.category ? <span className="tag">{s.category}</span> : null}
                    <span className="tag ghost">{s.read_time_min} min read</span>
                    {s.author ? <span className="tag ghost">By {s.author}</span> : null}
                  </div>
                </div>
                <div className="chev">{open ? "−" : "+"}</div>
              </div>

              {open && (
                <div
                  className="storyBody"
                  dangerouslySetInnerHTML={{ __html: s.content_html }}
                />
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
