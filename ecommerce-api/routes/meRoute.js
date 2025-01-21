import express from "express";
import meService from "../services/meService.js";
import meValidator from "../utils/validators/meValidator.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";
import resizeImage from "../middleware/imageProcessingMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

const { uploadSingleImage } = uploadMiddleware;
const { resizeProfileImage } = resizeImage;

const { changeMyPasswordValidator, updateMeValidator } = meValidator;

const { deactivateMe, getMe, changeMyPassword, updateMe } = meService;

const router = express.Router();

router.use(authMiddleware.protect);

router.get("/getMe", getMe);
router.put(
  "/changeMyPassword",

  changeMyPasswordValidator,
  changeMyPassword
);
router.put(
  "/updateMyData",
  uploadSingleImage("profileImg"),
  resizeProfileImage(),
  updateMeValidator,
  updateMe
);

router.delete("/deactivateMe", deactivateMe);

export default router;
