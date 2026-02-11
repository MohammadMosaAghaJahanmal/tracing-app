import { Router } from "express";
import { getRandomQuestion, getSliderImagesGrouped, getSocialLinks, getStories } from "../controllers/publicContentController.js";

const router = Router();

router.get("/question", getRandomQuestion);
router.get("/slider-images", getSliderImagesGrouped);
router.get("/social-links", getSocialLinks);
router.get("/stories", getStories);

export default router;
