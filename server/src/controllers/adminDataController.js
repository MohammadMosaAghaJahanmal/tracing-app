import { asyncHandler } from "../middleware/asyncHandler.js";
import { Op } from "sequelize";
import UserTracking from "../models/UserTracking.js";
import UserResponse from "../models/UserResponse.js";
import UserLiveText from "../models/UserLiveText.js";
import ButtonClick from "../models/ButtonClick.js";
import { toCSV } from "../utils/csv.js";

const paginate = (req) => {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(100, Math.max(5, Number(req.query.limit || 20)));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

const parseDate = (v) => {
  const s = String(v || "").trim();
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
};

const dateRangeWhere = (from, to) => {
  const f = parseDate(from);
  const t = parseDate(to);
  if (!f && !t) return null;
  const where = {};
  if (f) where[Op.gte] = f;
  if (t) where[Op.lte] = t;
  return where;
};

// ---------------- Tracking ----------------
export const getTrackingData = asyncHandler(async (req, res) => {
  const { page, limit, offset } = paginate(req);
  const q = String(req.query.q || "").trim();

  const where = q ? { session_id: { [Op.like]: `%${q}%` } } : undefined;

  const { rows, count } = await UserTracking.findAndCountAll({
    where,
    order: [["createdAt", "DESC"]],
    limit,
    offset
  });

  res.json({ rows, page, total: count, totalPages: Math.ceil(count / limit) });
});

// ---------------- Responses (Manage) ----------------
export const getResponses = asyncHandler(async (req, res) => {
  const { page, limit, offset } = paginate(req);

  const q = String(req.query.q || "").trim(); // session or text
  const reviewed = String(req.query.reviewed || "").trim(); // true/false/empty
  const from = req.query.from;
  const to = req.query.to;

  const where = {};
  if (q) {
    where[Op.or] = [
      { session_id: { [Op.like]: `%${q}%` } },
      { question_text: { [Op.like]: `%${q}%` } },
      { response_text: { [Op.like]: `%${q}%` } }
    ];
  }
  if (reviewed === "true") where.is_reviewed = true;
  if (reviewed === "false") where.is_reviewed = false;

  const dr = dateRangeWhere(from, to);
  if (dr) where.createdAt = dr;

  const { rows, count } = await UserResponse.findAndCountAll({
    where,
    order: [["createdAt", "DESC"]],
    limit,
    offset
  });

  res.json({ rows, page, total: count, totalPages: Math.ceil(count / limit) });
});

export const updateResponse = asyncHandler(async (req, res) => {
  const row = await UserResponse.findByPk(req.params.id);
  if (!row) return res.status(404).json({ message: "Not found" });

  const { is_reviewed, admin_notes } = req.body || {};
  await row.update({
    is_reviewed: typeof is_reviewed === "boolean" ? is_reviewed : row.is_reviewed,
    admin_notes: typeof admin_notes === "string" ? admin_notes : row.admin_notes
  });

  res.json({ row });
});

export const deleteResponse = asyncHandler(async (req, res) => {
  const row = await UserResponse.findByPk(req.params.id);
  if (!row) return res.status(404).json({ message: "Not found" });
  await row.destroy();
  res.json({ ok: true });
});

export const exportResponsesCSV = asyncHandler(async (req, res) => {
  const rows = await UserResponse.findAll({ order: [["createdAt", "DESC"]], limit: 5000 });
  const plain = rows.map((r) => r.toJSON());
  const csv = toCSV(plain);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=responses.csv");
  res.send(csv);
});

// ---------------- Live Text (Manage) ----------------
export const getLiveText = asyncHandler(async (req, res) => {
  const { page, limit, offset } = paginate(req);

  const q = String(req.query.q || "").trim(); // session or content
  const field = String(req.query.field || "").trim(); // field_key
  const reviewed = String(req.query.reviewed || "").trim();
  const from = req.query.from;
  const to = req.query.to;

  const where = {};
  if (q) {
    where[Op.or] = [
      { session_id: { [Op.like]: `%${q}%` } },
      { content: { [Op.like]: `%${q}%` } }
    ];
  }
  if (field) where.field_key = field;
  if (reviewed === "true") where.is_reviewed = true;
  if (reviewed === "false") where.is_reviewed = false;

  const dr = dateRangeWhere(from, to);
  if (dr) where.createdAt = dr;

  const { rows, count } = await UserLiveText.findAndCountAll({
    where,
    order: [["createdAt", "DESC"]],
    limit,
    offset
  });

  res.json({ rows, page, total: count, totalPages: Math.ceil(count / limit) });
});

export const updateLiveText = asyncHandler(async (req, res) => {
  const row = await UserLiveText.findByPk(req.params.id);
  if (!row) return res.status(404).json({ message: "Not found" });

  const { is_reviewed, admin_notes } = req.body || {};
  await row.update({
    is_reviewed: typeof is_reviewed === "boolean" ? is_reviewed : row.is_reviewed,
    admin_notes: typeof admin_notes === "string" ? admin_notes : row.admin_notes
  });

  res.json({ row });
});

export const deleteLiveText = asyncHandler(async (req, res) => {
  const row = await UserLiveText.findByPk(req.params.id);
  if (!row) return res.status(404).json({ message: "Not found" });
  await row.destroy();
  res.json({ ok: true });
});

export const exportLiveTextCSV = asyncHandler(async (req, res) => {
  const rows = await UserLiveText.findAll({ order: [["createdAt", "DESC"]], limit: 5000 });
  const plain = rows.map((r) => r.toJSON());
  const csv = toCSV(plain);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=live_text.csv");
  res.send(csv);
});

// ---------------- Clicks ----------------
export const getClicks = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(100, Math.max(5, Number(req.query.limit || 20)));
  const offset = (page - 1) * limit;

  const q = String(req.query.q || "").trim();         // search in label/type/selector/page_url
  const type = String(req.query.type || "").trim();   // exact type
  const label = String(req.query.label || "").trim(); // exact label
  const session = String(req.query.session || "").trim();

  const from = String(req.query.from || "").trim();   // yyyy-mm-dd
  const to = String(req.query.to || "").trim();

  const where = {};

  if (session) where.session_id = { [Op.like]: `%${session}%` };

  if (type) where.type = type;
  if (label) where.label = label;

  if (q) {
    where[Op.or] = [
      { label: { [Op.like]: `%${q}%` } },
      { type: { [Op.like]: `%${q}%` } },
      { selector: { [Op.like]: `%${q}%` } },
      { page_url: { [Op.like]: `%${q}%` } }
    ];
  }

  // date filter
  const f = from ? new Date(from) : null;
  const t = to ? new Date(to) : null;
  if (f && !Number.isNaN(f.getTime())) {
    where.createdAt = { ...(where.createdAt || {}), [Op.gte]: f };
  }
  if (t && !Number.isNaN(t.getTime())) {
    // include full day
    t.setHours(23, 59, 59, 999);
    where.createdAt = { ...(where.createdAt || {}), [Op.lte]: t };
  }

  const { rows, count } = await ButtonClick.findAndCountAll({
    where,
    order: [["createdAt", "DESC"]],
    limit,
    offset
  });

  res.json({ rows, page, total: count, totalPages: Math.ceil(count / limit) });
});


// ---------------- Tracking export ----------------
export const exportTrackingCSV = asyncHandler(async (req, res) => {
  const rows = await UserTracking.findAll({ order: [["createdAt", "DESC"]], limit: 5000 });
  const plain = rows.map((r) => r.toJSON());
  const csv = toCSV(plain);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=tracking.csv");
  res.send(csv);
});


export const deleteClick = asyncHandler(async (req, res) => {
  const row = await ButtonClick.findByPk(req.params.id);
  if (!row) return res.status(404).json({ message: "Not found" });
  await row.destroy();
  res.json({ ok: true });
});

export const bulkDeleteClicks = asyncHandler(async (req, res) => {
  const { ids, deleteAll } = req.body || {};

  // Delete ALL
  if (deleteAll === true) {
    const deleted = await ButtonClick.destroy({ where: {} });
    return res.json({ ok: true, deleted });
  }

  // Delete selected
  if (!Array.isArray(ids) || !ids.length) {
    return res.status(400).json({ message: "ids array is required" });
  }

  const deleted = await ButtonClick.destroy({
    where: { id: { [Op.in]: ids } }
  });

  res.json({ ok: true, deleted });
});

export const exportClicksCSV = asyncHandler(async (req, res) => {
  const rows = await ButtonClick.findAll({ order: [["createdAt", "DESC"]], limit: 5000 });
  const csv = toCSV(rows.map((r) => r.toJSON()));

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=button_clicks.csv");
  res.send(csv);
});

