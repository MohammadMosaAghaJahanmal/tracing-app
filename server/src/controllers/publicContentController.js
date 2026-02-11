import { asyncHandler } from "../middleware/asyncHandler.js";
import Question from "../models/Question.js";
import SliderImage from "../models/SliderImage.js";
import SocialLink from "../models/SocialLink.js";
import Story from "../models/Story.js";

export const getRandomQuestion = asyncHandler(async (req, res) => {
  const active = await Question.findAll({ where: { is_active: true }, order: [["display_order", "ASC"]] });
  if (!active.length) return res.json({ question: null });

  const q = active[Math.floor(Math.random() * active.length)];
  res.json({ question: { id: q.id, text: q.text } });
});

export const getSliderImagesGrouped = asyncHandler(async (req, res) => {
  const images = await SliderImage.findAll({
    where: { is_active: true },
    order: [["group_index", "ASC"], ["display_order", "ASC"]]
  });

  // group_index => array (two images per slide recommended by admin)
  const grouped = {};
  for (const img of images) {
    grouped[img.group_index] ||= [];
    grouped[img.group_index].push({
      id: img.id,
      image_url: img.image_url,
      title: img.title,
      description: img.description
    });
  }

  const slides = Object.keys(grouped)
    .sort((a, b) => Number(a) - Number(b))
    .map((k) => grouped[k]);

  res.json({ slides });
});

export const getSocialLinks = asyncHandler(async (req, res) => {
  const links = await SocialLink.findAll({
    where: { is_active: true },
    order: [["display_order", "ASC"]]
  });

  res.json({
    links: links.map((l) => ({
      id: l.id,
      platform: l.platform,
      url: l.url,
      description: l.description,
      icon_key: l.icon_key
    }))
  });
});

export const getStories = asyncHandler(async (req, res) => {
  const stories = await Story.findAll({
    where: { is_published: true },
    order: [["display_order", "ASC"]]
  });

  res.json({
    stories: stories.map((s) => ({
      id: s.id,
      title: s.title,
      content_html: s.content_html,
      category: s.category,
      author: s.author,
      read_time_min: s.read_time_min
    }))
  });
});
