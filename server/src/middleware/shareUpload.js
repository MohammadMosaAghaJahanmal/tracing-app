import multer from "multer";
import path from "path";
import fs from "fs";

const sharesDir = path.join(process.cwd(), "uploads", "shares");
fs.mkdirSync(sharesDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, sharesDir),
  filename: (req, file, cb) => {
    const safeExt = path.extname(file.originalname || "").slice(0, 10);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`;
    cb(null, name);
  }
});

const allowed = new Set([
  "image/jpeg", "image/png", "image/webp", "image/gif",
  "video/mp4", "video/webm", "video/quicktime"
]);

export const shareUpload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB per file
  fileFilter: (req, file, cb) => {
    if (!allowed.has(file.mimetype)) return cb(new Error("Invalid file type"));
    cb(null, true);
  }
});
