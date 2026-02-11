import { asyncHandler } from "../middleware/asyncHandler.js";
import { comparePassword, hashPassword } from "../utils/hash.js";
import { signJwt } from "../utils/jwt.js";
import Admin from "../models/Admin.js";

// Auto seed default admin if not exists
export const ensureDefaultAdmin = async () => {
  const email = "admin@example.com";
  const exists = await Admin.findOne({ where: { email } });
  if (!exists) {
    const password_hash = await hashPassword("Admin@123");
    await Admin.create({ email, password_hash, name: "Default Admin" });
    console.log("✅ Default admin seeded: admin@example.com / Admin@123");
  }
};

export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  const admin = await Admin.findOne({ where: { email } });
  if (!admin) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await comparePassword(password || "", admin.password_hash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = signJwt({ admin_id: admin.id, email: admin.email, name: admin.name });
  res.json({ token, admin: { id: admin.id, email: admin.email, name: admin.name } });
});
