import fetch from "node-fetch";
import { env } from "../config/env.js";

export const getClientIp = (req) => {
  const xf = req.headers["x-forwarded-for"];
  const ip = (xf ? String(xf).split(",")[0] : req.socket?.remoteAddress || req.ip || "")
    .replace("::ffff:", "")
    .trim();
  return ip;
};

// “approximate” geo (country/city) – external provider optional
export const lookupGeo = async (ip) => {
  if (!ip || ip === "127.0.0.1" || ip === "::1") return null;

  if (env.GEO_PROVIDER === "ipapi") {
    try {
      const res = await fetch(`${env.IPAPI_BASE}/${ip}/json/`, { timeout: 4000 });
      if (!res.ok) return null;
      const j = await res.json();
      return {
        country: j.country_name || j.country || null,
        city: j.city || null,
        region: j.region || null,
        latitude: j.latitude ?? null,
        longitude: j.longitude ?? null
      };
    } catch {
      return null;
    }
  }

  // local provider fallback (no city) — still acceptable if you don’t want external calls
  return { country: null, city: null, region: null, latitude: null, longitude: null };
};
