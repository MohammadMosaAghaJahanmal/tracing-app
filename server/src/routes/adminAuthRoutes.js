import { Router } from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validate.js";
import { loginAdmin, ensureDefaultAdmin } from "../controllers/adminAuthController.js";

const router = Router();

// Seed admin at boot time (first request-safe)
router.use(async (req, res, next) => {
  await ensureDefaultAdmin();
  next();
});

router.post(
  "/login",
  [body("email").isEmail(), body("password").isString().isLength({ min: 6 })],
  validate,
  loginAdmin
);

export default router;
