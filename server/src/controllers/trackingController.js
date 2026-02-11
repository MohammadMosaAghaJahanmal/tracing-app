import { asyncHandler } from "../middleware/asyncHandler.js";
import { getClientIp, lookupGeo } from "../utils/geo.js";
import { sanitizeText } from "../utils/sanitize.js";
import { v4 as uuidv4 } from "uuid";

import UserTracking from "../models/UserTracking.js";
import ButtonClick from "../models/ButtonClick.js";
import UserResponse from "../models/UserResponse.js";
import UserLiveText from "../models/UserLiveText.js";

export const startOrUpdateSession = asyncHandler(async (req, res) => {
  const {
    session_id,
    os,
    browser,
    device,
    user_agent,
    language,
    timezone,
    screen_resolution,
    referrer
  } = req.body || {};

  const ip = getClientIp(req);
  const geo = await lookupGeo(ip);

  const sid = sanitizeText(session_id) || uuidv4();

  const [row] = await UserTracking.findOrCreate({
    where: { session_id: sid },
    defaults: {
      session_id: sid,
      ip,
      country: geo?.country || null,
      city: geo?.city || null,
      region: geo?.region || null,
      latitude: geo?.latitude || null,
      longitude: geo?.longitude || null,
      os: sanitizeText(os),
      browser: sanitizeText(browser),
      device: sanitizeText(device),
      user_agent: sanitizeText(user_agent),
      language: sanitizeText(language),
      timezone: sanitizeText(timezone),
      screen_resolution: sanitizeText(screen_resolution),
      referrer: sanitizeText(referrer),
      first_seen_at: new Date(),
      last_seen_at: new Date()
    }
  });

  // update last seen + info
  await row.update({
    ip,
    country: row.country || geo?.country || null,
    city: row.city || geo?.city || null,
    region: row.region || geo?.region || null,
    latitude: row.latitude || geo?.latitude || null,
    longitude: row.longitude || geo?.longitude || null,
    os: sanitizeText(os),
    browser: sanitizeText(browser),
    device: sanitizeText(device),
    user_agent: sanitizeText(user_agent),
    language: sanitizeText(language),
    timezone: sanitizeText(timezone),
    screen_resolution: sanitizeText(screen_resolution),
    referrer: sanitizeText(referrer),
    last_seen_at: new Date()
  });

  res.json({ session_id: sid });
});

export const logButtonClick = asyncHandler(async (req, res) => {
  const { session_id, element_type, label, x, y, page, meta } = req.body || {};
  if (!session_id || !element_type) return res.status(400).json({ message: "Missing session_id/element_type" });

  await ButtonClick.create({
    session_id: sanitizeText(session_id),
    element_type: sanitizeText(element_type),
    label: sanitizeText(label),
    page: sanitizeText(page),
    x: Number.isFinite(x) ? x : null,
    y: Number.isFinite(y) ? y : null,
    meta: meta && typeof meta === "object" ? meta : null
  });

  res.json({ ok: true });
});

export const saveResponse = asyncHandler(async (req, res) => {
  const { session_id, question_id, question_text, response_text, word_count, char_count } = req.body || {};
  if (!session_id || !response_text) return res.status(400).json({ message: "Missing session_id/response_text" });

  const row = await UserResponse.create({
    session_id: sanitizeText(session_id),
    question_id: question_id ?? null,
    question_text: sanitizeText(question_text),
    response_text: sanitizeText(response_text),
    word_count: Number.isFinite(word_count) ? word_count : null,
    char_count: Number.isFinite(char_count) ? char_count : null
  });

  res.json({ ok: true, id: row.id });
});

export const saveLiveText = asyncHandler(async (req, res) => {
  const { session_id, field_key, version, content, keystrokes, typing_duration_ms, typing_speed_kpm } = req.body || {};
  if (!session_id || typeof content !== "string") return res.status(400).json({ message: "Missing session_id/content" });

  const row = await UserLiveText.create({
    session_id: sanitizeText(session_id),
    field_key: sanitizeText(field_key) || "main",
    version: Number.isFinite(version) ? version : 1,
    content,
    keystrokes: Number.isFinite(keystrokes) ? keystrokes : null,
    typing_duration_ms: Number.isFinite(typing_duration_ms) ? typing_duration_ms : null,
    typing_speed_kpm: Number.isFinite(typing_speed_kpm) ? typing_speed_kpm : null
  });

  res.json({ ok: true, id: row.id });
});
