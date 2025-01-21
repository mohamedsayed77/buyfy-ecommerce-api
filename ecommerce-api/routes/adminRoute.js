import express from "express";

import adminService from "../services/adminService.js";
import adminValidator from "../utils/validators/adminValidator.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";
import resizeImage from "../middleware/imageProcessingMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

const { uploadSingleImage } = uploadMiddleware;
const { resizeProfileImage } = resizeImage;

const {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  changePasswordValidator,
  deleteUserValidator,
} = adminValidator;

const {
  getUsers,
  createUser,
  getUser,
  updateUser,
  changePassword,
  deleteUser,
} = adminService;

const router = express.Router();

// admin
router.use(authMiddleware.protect, authMiddleware.allowedTo("admin"));

router
  .route("/")
  .get(getUsers)
  .post(
    uploadSingleImage("profileImg"),
    resizeProfileImage(),
    createUserValidator,
    createUser
  );

router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(
    uploadSingleImage("profileImg"),
    resizeProfileImage(),
    updateUserValidator,
    updateUser
  )
  .delete(deleteUserValidator, deleteUser);

router.put("/changepassword/:id", changePasswordValidator, changePassword);

export default router;
