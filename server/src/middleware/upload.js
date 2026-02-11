import multer from "multer";
import path from "path";
import fs from "fs";
import { env } from "../config/env.js";

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

ensureDir(env.UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, env.UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safe = Date.now() + "-" + file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, safe);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.mimetype)) return cb(new Error("Invalid file type"), false);
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: env.MAX_FILE_MB * 1024 * 1024 }
});
