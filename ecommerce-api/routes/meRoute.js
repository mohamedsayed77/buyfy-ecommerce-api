import express from "express";
import meService from "../services/meService.js";
import meValidator from "../utils/validators/meValidator.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";
import resizeImage from "../middleware/imageProcessingMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

// Destructure necessary methods and middleware
const { uploadSingleImage } = uploadMiddleware;
const { resizeProfileImage } = resizeImage;
const { changeMyPasswordValidator, updateMeValidator } = meValidator;
const { deactivateMe, getMe, changeMyPassword, updateMe } = meService;

// Create a new router instance
const router = express.Router();

/**
 * Middleware: Protect Routes
 * - Ensures only authenticated users can access these routes.
 */
router.use(authMiddleware.protect);

/**
 * Route: /api/v1/me/getMe
 * - GET: Retrieve current user's data.
 * - Access: Protected (authenticated users only).
 */
router.get("/getMe", getMe);

/**
 * Route: /api/v1/me/changeMyPassword
 * - PUT: Change current user's password.
 * - Middleware:
 *   - `changeMyPasswordValidator`: Validates the request body.
 * - Access: Protected (authenticated users only).
 */
router.put("/changeMyPassword", changeMyPasswordValidator, changeMyPassword);

/**
 * Route: /api/v1/me/updateMyData
 * - PUT: Update current user's profile data.
 * - Middleware:
 *   - `uploadSingleImage`: Handles profile image upload.
 *   - `resizeProfileImage`: Resizes the uploaded profile image.
 *   - `updateMeValidator`: Validates the request body.
 * - Access: Protected (authenticated users only).
 */
router.put(
  "/updateMyData",
  uploadSingleImage("profileImg"),
  resizeProfileImage(),
  updateMeValidator,
  updateMe
);

/**
 * Route: /api/v1/me/deactivateMe
 * - DELETE: Deactivate the current user's account.
 * - Access: Protected (authenticated users only).
 */
router.delete("/deactivateMe", deactivateMe);

export default router;
