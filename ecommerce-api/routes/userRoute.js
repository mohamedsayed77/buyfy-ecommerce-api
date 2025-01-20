import express from "express";
import userService from "../services/userService.js";

import uploadMiddleware from "../middleware/uploadMiddleware.js";
import resizeImage from "../middleware/imageProcessingMiddleware.js";

const { uploadSingleImage } = uploadMiddleware;
const { resizeProfileImage } = resizeImage;

const { getUsers, createUser, getUser, updateUser, changeUserPassword } =
  userService;

const router = express.Router();

// addmin

router
  .route("/")
  .get(getUsers)
  .post(uploadSingleImage("profileImg"), resizeProfileImage(), createUser);

router
  .route("/:id")
  .get(getUser)
  .put(uploadSingleImage("profileImg"), resizeProfileImage(), updateUser);

router.put("/changepassword/:id", changeUserPassword);

export default router;
