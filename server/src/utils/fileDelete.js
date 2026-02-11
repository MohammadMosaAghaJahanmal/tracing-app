import fs from "fs/promises";
import path from "path";

export const safeUnlink = async (absPath) => {
  try {
    await fs.unlink(absPath);
  } catch (err) {
    // ignore missing file
    if (err && err.code === "ENOENT") return;
    throw err;
  }
};

// file_url example: "/uploads/shares/abc.mp4"
export const sharesUrlToAbsPath = (fileUrl) => {
  const clean = String(fileUrl || "").trim();
  if (!clean.startsWith("/uploads/shares/")) return null;

  const filename = clean.replace("/uploads/shares/", "");
  // prevent path traversal
  const safeName = path.basename(filename);

  return path.join(process.cwd(), "uploads", "shares", safeName);
};
