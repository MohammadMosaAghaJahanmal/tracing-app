export async function ipToGeo(ip) {
  try {
    // For localhost, skip
    if (!ip || ip === "::1" || ip === "127.0.0.1") {
      return { country: null, city: null, region: null, org: null };
    }

    // ipapi.co supports: https://ipapi.co/<ip>/json/
    const url = `https://ipapi.co/${encodeURIComponent(ip)}/json/`;
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) return { country: null, city: null, region: null, org: null };

    const data = await res.json();

    return {
      country: data?.country_name || null,
      city: data?.city || null,
      region: data?.region || null,
      org: data?.org || null
    };
  } catch (e) {
    return { country: null, city: null, region: null, org: null };
  }
}
