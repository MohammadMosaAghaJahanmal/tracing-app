import React from "react";
import { iconFor } from "../../utils/icons";
import { logClick } from "../../utils/tracking";

export default function SocialLinks({ links }) {
  const arr = Array.isArray(links) ? links : [];

  return (
    <div className="card">
      {arr.length === 0 ? (
        <div className="muted">No social links. Add in Admin.</div>
      ) : (
        <div className="socialList">
          {arr.map((l) => (
            <a
              key={l.id}
              className="socialItem"
              href={l.url}
              target="_blank"
              rel="noreferrer"
              onClick={() =>
                logClick({
                  element_type: "link",
                  label: `Social ${l.platform}`,
                  page: window.location.pathname,
                  meta: { social_id: l.id, url: l.url }
                })
              }
            >
              <div className="socialIcon">{iconFor(l.platform)}</div>
              <div>
                <div className="socialName">{l.platform}</div>
                <div className="socialDesc">{l.description || l.url}</div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
