import { Router } from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validate.js";
import { startOrUpdateSession, logButtonClick, saveResponse, saveLiveText } from "../controllers/trackingController.js";
import { submitUserShare } from "../controllers/sharePublicController.js";
import { shareUpload } from "../middleware/shareUpload.js";

const router = Router();


router.post("/share", shareUpload.array("files", 10), submitUserShare);


router.post(
  "/session",
  [
    body("session_id").optional().isString(),
    body("os").optional().isString(),
    body("browser").optional().isString(),
    body("device").optional().isString(),
    body("user_agent").optional().isString(),
    body("language").optional().isString(),
    body("timezone").optional().isString(),
    body("screen_resolution").optional().isString(),
    body("referrer").optional().isString()
  ],
  validate,
  startOrUpdateSession
);

router.post(
  "/button-click",
  [body("session_id").isString(), body("element_type").isString()],
  validate,
  logButtonClick
);

router.post(
  "/save-response",
  [body("session_id").isString(), body("response_text").isString().isLength({ min: 1, max: 20000 })],
  validate,
  saveResponse
);

router.post(
  "/save-live-text",
  [body("session_id").isString(), body("content").isString().isLength({ max: 200000 })],
  validate,
  saveLiveText
);

export default router;
