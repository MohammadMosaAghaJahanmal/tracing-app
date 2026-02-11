import { asyncHandler } from "../middleware/asyncHandler.js";
import { sanitizeRichHtml, sanitizeText } from "../utils/sanitize.js";
import SliderImage from "../models/SliderImage.js";
import Question from "../models/Question.js";
import SocialLink from "../models/SocialLink.js";
import Story from "../models/Story.js";
import { env } from "../config/env.js";

const calcReadTime = (plainText) => {
  const words = String(plainText || "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

// QUESTIONS
export const listQuestions = asyncHandler(async (req, res) => {
  const rows = await Question.findAll({ order: [["display_order", "ASC"]] });
  res.json({ rows });
});

export const createQuestion = asyncHandler(async (req, res) => {
  const { text, display_order, is_active } = req.body || {};
  const row = await Question.create({
    text: sanitizeText(text),
    display_order: Number(display_order || 1),
    is_active: Boolean(is_active)
  });
  res.json({ row });
});

export const updateQuestion = asyncHandler(async (req, res) => {
  const row = await Question.findByPk(req.params.id);
  if (!row) return res.status(404).json({ message: "Not found" });
  const { text, display_order, is_active } = req.body || {};
  await row.update({
    text: sanitizeText(text),
    display_order: Number(display_order || row.display_order),
    is_active: typeof is_active === "boolean" ? is_active : row.is_active
  });
  res.json({ row });
});

export const deleteQuestion = asyncHandler(async (req, res) => {
  const row = await Question.findByPk(req.params.id);
  if (!row) return res.status(404).json({ message: "Not found" });
  await row.destroy();
  res.json({ ok: true });
});

// SLIDER IMAGES
export const listSliderImages = asyncHandler(async (req, res) => {
  const rows = await SliderImage.findAll({ order: [["group_index", "ASC"], ["display_order", "ASC"]] });
  res.json({ rows });
});

export const uploadSliderImages = asyncHandler(async (req, res) => {
  const { group_index, display_order, title, description, is_active } = req.body || {};
  const files = req.files || [];
  if (!files.length) return res.status(400).json({ message: "No files uploaded" });

  const created = [];
  for (const f of files) {
    const image_url = `/uploads/${f.filename}`;
    const row = await SliderImage.create({
      image_url,
      group_index: Number(group_index || 1),
      display_order: Number(display_order || 1),
      title: sanitizeText(title),
      description: sanitizeText(description),
      is_active: is_active !== undefined ? Boolean(is_active) : true
    });
    created.push(row);
  }

  res.json({ rows: created });
});

export const updateSliderImage = asyncHandler(async (req, res) => {
  const row = await SliderImage.findByPk(req.params.id);
  if (!row) return res.status(404).json({ message: "Not found" });

  const { group_index, display_order, title, description, is_active } = req.body || {};
  await row.update({
    group_index: Number(group_index ?? row.group_index),
    display_order: Number(display_order ?? row.display_order),
    title: sanitizeText(title ?? row.title),
    description: sanitizeText(description ?? row.description),
    is_active: typeof is_active === "boolean" ? is_active : row.is_active
  });

  res.json({ row });
});

export const deleteSliderImage = asyncHandler(async (req, res) => {
  const row = await SliderImage.findByPk(req.params.id);
  if (!row) return res.status(404).json({ message: "Not found" });
  await row.destroy();
  res.json({ ok: true });
});

// SOCIAL LINKS
export const listSocialLinks = asyncHandler(async (req, res) => {
  const rows = await SocialLink.findAll({ order: [["display_order", "ASC"]] });
  res.json({ rows });
});

export const createSocialLink = asyncHandler(async (req, res) => {
  const { platform, url, description, icon_key, display_order, is_active } = req.body || {};
  const row = await SocialLink.create({
    platform: sanitizeText(platform),
    url: sanitizeText(url),
    description: sanitizeText(description),
    icon_key: sanitizeText(icon_key),
    display_order: Number(display_order || 1),
    is_active: is_active !== undefined ? Boolean(is_active) : true
  });
  res.json({ row });
});

export const updateSocialLink = asyncHandler(async (req, res) => {
  const row = await SocialLink.findByPk(req.params.id);
  if (!row) return res.status(404).json({ message: "Not found" });

  const { platform, url, description, icon_key, display_order, is_active } = req.body || {};
  await row.update({
    platform: sanitizeText(platform ?? row.platform),
    url: sanitizeText(url ?? row.url),
    description: sanitizeText(description ?? row.description),
    icon_key: sanitizeText(icon_key ?? row.icon_key),
    display_order: Number(display_order ?? row.display_order),
    is_active: typeof is_active === "boolean" ? is_active : row.is_active
  });
  res.json({ row });
});

export const deleteSocialLink = asyncHandler(async (req, res) => {
  const row = await SocialLink.findByPk(req.params.id);
  if (!row) return res.status(404).json({ message: "Not found" });
  await row.destroy();
  res.json({ ok: true });
});

// STORIES
export const listStories = asyncHandler(async (req, res) => {
  const rows = await Story.findAll({ order: [["display_order", "ASC"]] });
  res.json({ rows });
});

export const createStory = asyncHandler(async (req, res) => {
  const { title, content_html, category, author, display_order, is_published } = req.body || {};
  const cleanHtml = sanitizeRichHtml(content_html || "");
  const read_time_min = calcReadTime(cleanHtml.replace(/<[^>]+>/g, " "));

  const row = await Story.create({
    title: sanitizeText(title),
    content_html: cleanHtml,
    category: sanitizeText(category),
    author: sanitizeText(author),
    display_order: Number(display_order || 1),
    is_published: is_published !== undefined ? Boolean(is_published) : true,
    read_time_min
  });

  res.json({ row });
});

export const updateStory = asyncHandler(async (req, res) => {
  const row = await Story.findByPk(req.params.id);
  if (!row) return res.status(404).json({ message: "Not found" });

  const { title, content_html, category, author, display_order, is_published } = req.body || {};
  const cleanHtml = content_html !== undefined ? sanitizeRichHtml(content_html || "") : row.content_html;
  const read_time_min = calcReadTime(cleanHtml.replace(/<[^>]+>/g, " "));

  await row.update({
    title: sanitizeText(title ?? row.title),
    content_html: cleanHtml,
    category: sanitizeText(category ?? row.category),
    author: sanitizeText(author ?? row.author),
    display_order: Number(display_order ?? row.display_order),
    is_published: typeof is_published === "boolean" ? is_published : row.is_published,
    read_time_min
  });

  res.json({ row });
});

export const deleteStory = asyncHandler(async (req, res) => {
  const row = await Story.findByPk(req.params.id);
  if (!row) return res.status(404).json({ message: "Not found" });
  await row.destroy();
  res.json({ ok: true });
});
