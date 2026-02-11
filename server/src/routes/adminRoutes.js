import { Router } from "express";
import { requireAdmin } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

import { getDashboardStats } from "../controllers/adminDashboardController.js";
import {
  listQuestions, createQuestion, updateQuestion, deleteQuestion,
  listSliderImages, uploadSliderImages, updateSliderImage, deleteSliderImage,
  listSocialLinks, createSocialLink, updateSocialLink, deleteSocialLink,
  listStories, createStory, updateStory, deleteStory
} from "../controllers/adminContentController.js";

import { getTrackingData, getResponses, getLiveText, getClicks, exportTrackingCSV, updateResponse, deleteResponse, updateLiveText, deleteLiveText, exportResponsesCSV, exportLiveTextCSV, deleteClick, bulkDeleteClicks, exportClicksCSV } from "../controllers/adminDataController.js";

const router = Router();

router.use(requireAdmin);

// dashboard
router.get("/dashboard", getDashboardStats);

// content CRUD
router.get("/questions", listQuestions);
router.post("/questions", createQuestion);
router.put("/questions/:id", updateQuestion);
router.delete("/questions/:id", deleteQuestion);

router.get("/slider-images", listSliderImages);
router.post("/slider-images/upload", upload.array("images", 10), uploadSliderImages);
router.put("/slider-images/:id", updateSliderImage);
router.delete("/slider-images/:id", deleteSliderImage);

router.get("/social-links", listSocialLinks);
router.post("/social-links", createSocialLink);
router.put("/social-links/:id", updateSocialLink);
router.delete("/social-links/:id", deleteSocialLink);

router.get("/stories", listStories);
router.post("/stories", createStory);
router.put("/stories/:id", updateStory);
router.delete("/stories/:id", deleteStory);

router.get("/tracking", getTrackingData);

router.get("/responses", getResponses);
router.put("/responses/:id", updateResponse);
router.delete("/responses/:id", deleteResponse);

router.get("/live-text", getLiveText);
router.put("/live-text/:id", updateLiveText);
router.delete("/live-text/:id", deleteLiveText);

router.get("/clicks", getClicks);

router.get("/export/tracking.csv", exportTrackingCSV);
router.get("/export/responses.csv", exportResponsesCSV);
router.get("/export/live_text.csv", exportLiveTextCSV);

router.delete("/clicks/:id", deleteClick);
router.delete("/clicks", bulkDeleteClicks); // body: { ids:[..] } OR { deleteAll:true }
router.get("/export/clicks.csv", exportClicksCSV);



export default router;
