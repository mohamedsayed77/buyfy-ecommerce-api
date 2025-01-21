import express from "express";

import userService from "../services/userService.js";
import userValidator from "../utils/validators/userValidator.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";
import resizeImage from "../middleware/imageProcessingMiddleware.js";

const { uploadSingleImage } = uploadMiddleware;
const { resizeProfileImage } = resizeImage;

const {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  changePasswordValidator,
} = userValidator;

const { getUsers, createUser, getUser, updateUser, changeUserPassword } =
  userService;

const router = express.Router();

// addmin

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
  );

router.put("/changepassword/:id", changePasswordValidator, changeUserPassword);

export default router;
