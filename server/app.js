import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { env } from "./src/config/env.js";
import { sequelize } from "./src/config/db.js";
import { initModels } from "./src/models/index.js";

import healthRoutes from "./src/routes/healthRoutes.js";
import publicContentRoutes from "./src/routes/publicContentRoutes.js";
import trackingRoutes from "./src/routes/trackingRoutes.js";
import adminAuthRoutes from "./src/routes/adminAuthRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";

import { globalRateLimiter, publicRateLimiter } from "./src/middleware/rateLimit.js";
import { errorHandler, notFound } from "./src/middleware/errorHandler.js";
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security + logs
app.use(helmet());
app.use(morgan("dev"));

// JSON parsing
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true
  })
);

// Rate limiting
app.use(globalRateLimiter);

// Static uploads
// app.use("/uploads", express.static(path.join(__dirname, env.UPLOAD_DIR)));

app.use("/uploads/shares", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", env.CLIENT_ORIGIN);
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}, express.static(path.join(process.cwd(), "uploads", "shares")));


app.use("/uploads", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", env.CLIENT_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}, express.static(path.join(__dirname, env.UPLOAD_DIR)));


// Routes
app.use("/api/health", healthRoutes);
app.use("/api/content", publicRateLimiter, publicContentRoutes);
app.use("/api/tracking", publicRateLimiter, trackingRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/admin", adminRoutes);

// 404 + error handler
app.use(notFound);
app.use(errorHandler);
// Start
(async () => {
  try {
    initModels(sequelize);

    await sequelize.authenticate();

    // Auto create tables if not exist
    await sequelize.sync({ alter: env.NODE_ENV !== "production" });

    console.log("✅ DB connected & tables synced");

    // const port = env.PORT;
    // app.listen(port, () => console.log(`✅ Server running on http://localhost:${port}`));
  } catch (err) {
    console.error("❌ Server failed:", err);
    process.exit(1);
  }
})();


export default app;