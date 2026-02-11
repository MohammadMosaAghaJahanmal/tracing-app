import dotenv from "dotenv";
dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 8080),

  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: Number(process.env.DB_PORT || 3306),
  DB_NAME: process.env.DB_NAME || "tracking_app",
  DB_USER: process.env.DB_USER || "root",
  DB_PASS: process.env.DB_PASS || "",

  JWT_SECRET: process.env.JWT_SECRET || "change_me",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:3000",

  UPLOAD_DIR: process.env.UPLOAD_DIR || "uploads",
  MAX_FILE_MB: Number(process.env.MAX_FILE_MB || 8),

  GEO_PROVIDER: process.env.GEO_PROVIDER || "local",
  IPAPI_BASE: process.env.IPAPI_BASE || "https://ipapi.co"
};
