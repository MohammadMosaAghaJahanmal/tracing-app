import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const signJwt = (payload) => jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
export const verifyJwt = (token) => jwt.verify(token, env.JWT_SECRET);
