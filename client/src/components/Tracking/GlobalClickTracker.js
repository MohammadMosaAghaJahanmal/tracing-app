import React, { useEffect } from "react";
import { logClick } from "../../utils/tracking";

export default function GlobalClickTracker() {
  useEffect(() => {
    const handler = (e) => {
      const el = e.target;
      const label =
        el?.getAttribute?.("aria-label") ||
        el?.innerText?.slice(0, 120) ||
        el?.alt ||
        el?.id ||
        el?.className ||
        "unknown";

      const tag = (el?.tagName || "").toLowerCase();
      const element_type = tag === "a" ? "link" : tag === "img" ? "image" : tag === "button" ? "button" : tag || "element";

      logClick({
        element_type,
        label,
        x: e.clientX,
        y: e.clientY,
        page: window.location.pathname,
        meta: {
          tag,
          href: el?.href || null
        }
      });
    };

    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, []);

  return null;
}
