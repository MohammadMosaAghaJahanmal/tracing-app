import { asyncHandler } from "../middleware/asyncHandler.js";
import ShareRequest from "../models/ShareRequest.js";
import UserShare from "../models/UserShare.js";
import UserShareFile from "../models/UserShareFile.js";

export const getActiveShareRequest = asyncHandler(async (req, res) => {
  const row = await ShareRequest.findOne({
    where: { is_active: true },
    order: [["display_order", "ASC"], ["createdAt", "DESC"]]
  });
  res.json({ row: row || null });
});

export const submitUserShare = asyncHandler(async (req, res) => {
  const session_id = String(req.body.session_id || "").trim();
  const share_request_id = req.body.share_request_id ? Number(req.body.share_request_id) : null;
  const message = String(req.body.message || "").trim();

  if (!session_id) return res.status(400).json({ message: "session_id is required" });

  let title_snapshot = null;
  if (share_request_id) {
    const r = await ShareRequest.findByPk(share_request_id);
    title_snapshot = r ? r.title : null;
  }

  const files = req.files || [];
  if (!files.length) return res.status(400).json({ message: "At least 1 file is required" });

  const share = await UserShare.create({
    session_id,
    share_request_id,
    title_snapshot,
    message: message || null,
    file_count: files.length
  });

  const fileRows = [];
  for (const f of files) {
    const url = `/uploads/shares/${f.filename}`;
    const fr = await UserShareFile.create({
      user_share_id: share.id,
      original_name: f.originalname,
      mime_type: f.mimetype,
      size_bytes: f.size,
      file_url: url
    });
    fileRows.push(fr);
  }

  res.json({ ok: true, share_id: share.id, files: fileRows });
});
