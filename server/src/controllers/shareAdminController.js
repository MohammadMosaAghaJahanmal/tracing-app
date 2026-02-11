import { asyncHandler } from "../middleware/asyncHandler.js";
import { Op } from "sequelize";
import ShareRequest from "../models/ShareRequest.js";
import UserShare from "../models/UserShare.js";
import UserShareFile from "../models/UserShareFile.js";
import { safeUnlink, sharesUrlToAbsPath } from "../utils/fileDelete.js";
const paginate = (req) => {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(100, Math.max(5, Number(req.query.limit || 20)));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

export const listShareRequests = asyncHandler(async (req, res) => {
  const rows = await ShareRequest.findAll({ order: [["display_order", "ASC"], ["createdAt", "DESC"]] });
  res.json({ rows });
});

export const createShareRequest = asyncHandler(async (req, res) => {
  const title = String(req.body.title || "").trim();
  const description = String(req.body.description || "").trim();
  const is_active = !!req.body.is_active;
  const display_order = Number(req.body.display_order || 1);

  if (!title) return res.status(400).json({ message: "title is required" });

  // Only one active at a time (recommended)
  if (is_active) {
    await ShareRequest.update({ is_active: false }, { where: {} });
  }

  const row = await ShareRequest.create({
    title,
    description: description || null,
    is_active,
    display_order
  });

  res.json({ row });
});

export const updateShareRequest = asyncHandler(async (req, res) => {
  const row = await ShareRequest.findByPk(req.params.id);
  if (!row) return res.status(404).json({ message: "Not found" });

  const patch = {};
  if (typeof req.body.title === "string") patch.title = req.body.title.trim();
  if (typeof req.body.description === "string") patch.description = req.body.description.trim() || null;
  if (typeof req.body.display_order !== "undefined") patch.display_order = Number(req.body.display_order || 1);

  if (typeof req.body.is_active === "boolean") {
    patch.is_active = req.body.is_active;
    if (req.body.is_active) {
      await ShareRequest.update({ is_active: false }, { where: { id: { [Op.ne]: row.id } } });
    }
  }

  await row.update(patch);
  res.json({ row });
});

export const deleteShareRequest = asyncHandler(async (req, res) => {
  const row = await ShareRequest.findByPk(req.params.id);
  if (!row) return res.status(404).json({ message: "Not found" });
  await row.destroy();
  res.json({ ok: true });
});

// User shares
export const listUserShares = asyncHandler(async (req, res) => {
  const { page, limit, offset } = paginate(req);
  const q = String(req.query.q || "").trim();

  const where = {};
  if (q) {
    where[Op.or] = [
      { session_id: { [Op.like]: `%${q}%` } },
      { title_snapshot: { [Op.like]: `%${q}%` } },
      { message: { [Op.like]: `%${q}%` } }
    ];
  }

  const { rows, count } = await UserShare.findAndCountAll({
    where,
    include: [{ model: UserShareFile, as: "files" }],
    order: [["createdAt", "DESC"]],
    limit,
    offset
  });

  res.json({ rows, page, total: count, totalPages: Math.ceil(count / limit) });
});

export const deleteUserShare = asyncHandler(async (req, res) => {
  const row = await UserShare.findByPk(req.params.id);
  if (!row) return res.status(404).json({ message: "Not found" });

  const files = await UserShareFile.findAll({ where: { user_share_id: row.id } });

  // delete physical files
  for (const f of files) {
    const abs = sharesUrlToAbsPath(f.file_url);
    if (abs) await safeUnlink(abs);
  }

  // delete DB rows
  await UserShareFile.destroy({ where: { user_share_id: row.id } });
  await row.destroy();

  res.json({ ok: true });
});


export const bulkDeleteUserShares = asyncHandler(async (req, res) => {
  const { ids, deleteAll } = req.body || {};

  // DELETE ALL
  if (deleteAll === true) {
    const files = await UserShareFile.findAll();

    for (const f of files) {
      const abs = sharesUrlToAbsPath(f.file_url);
      if (abs) await safeUnlink(abs);
    }

    await UserShareFile.destroy({ where: {} });
    const deleted = await UserShare.destroy({ where: {} });

    return res.json({ ok: true, deleted });
  }

  // DELETE SELECTED
  if (!Array.isArray(ids) || !ids.length) {
    return res.status(400).json({ message: "ids array is required" });
  }

  const files = await UserShareFile.findAll({
    where: { user_share_id: { [Op.in]: ids } }
  });

  for (const f of files) {
    const abs = sharesUrlToAbsPath(f.file_url);
    if (abs) await safeUnlink(abs);
  }

  await UserShareFile.destroy({ where: { user_share_id: { [Op.in]: ids } } });
  const deleted = await UserShare.destroy({ where: { id: { [Op.in]: ids } } });

  res.json({ ok: true, deleted });
});
