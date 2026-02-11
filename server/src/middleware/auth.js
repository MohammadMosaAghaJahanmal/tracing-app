import { verifyJwt } from "../utils/jwt.js";

export const requireAdmin = (req, res, next) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Missing token" });

  try {
    const payload = verifyJwt(token);
    req.admin = payload;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid/expired token" });
  }
};
