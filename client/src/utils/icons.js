export const iconFor = (platform) => {
  const p = String(platform || "").toLowerCase();
  if (p.includes("instagram")) return "📷";
  if (p.includes("facebook")) return "📘";
  if (p.includes("twitter") || p.includes("x")) return "𝕏";
  if (p.includes("youtube")) return "▶️";
  if (p.includes("tiktok")) return "🎵";
  if (p.includes("linkedin")) return "💼";
  return "🔗";
};
