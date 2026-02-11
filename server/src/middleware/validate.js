import { validationResult } from "express-validator";

export const validate = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({
      message: "Validation error",
      errors: result.array()
    });
  }
  next();
};
