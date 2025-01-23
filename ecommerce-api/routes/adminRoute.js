import express from "express";

import adminService from "../services/adminService.js";
import adminValidator from "../utils/validators/adminValidator.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";
import resizeImage from "../middleware/imageProcessingMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

// Destructure methods and middleware
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

// Initialize the router
const router = express.Router();

/**
 * Middleware: Protect routes and restrict access to admin users only
 */
router.use(authMiddleware.protect, authMiddleware.allowedTo("admin"));

/**
 * Route: /api/v1/admin/
 * - GET: Fetch all users (Admin-only access)
 * - POST: Create a new user (Admin-only access)
 */
router
  .route("/")
  .get(getUsers) // Fetch all users
  .post(
    uploadSingleImage("profileImg"), // Upload single profile image
    resizeProfileImage(), // Resize profile image
    createUserValidator, // Validate request body for creating a user
    createUser // Create a new user
  );

/**
 * Route: /api/v1/admin/:id
 * - GET: Fetch a specific user by ID
 * - PUT: Update a specific user by ID
 * - DELETE: Delete a specific user by ID
 */
router
  .route("/:id")
  .get(getUserValidator, getUser) // Fetch user by ID
  .put(
    uploadSingleImage("profileImg"), // Upload single profile image
    resizeProfileImage(), // Resize profile image
    updateUserValidator, // Validate request body for updating a user
    updateUser // Update user by ID
  )
  .delete(deleteUserValidator, deleteUser); // Delete user by ID

/**
 * Route: /api/v1/admin/changepassword/:id
 * - PUT: Change the password of a specific user
 */
router.put(
  "/changepassword/:id",
  changePasswordValidator, // Validate request body for changing password
  changePassword // Change password for the user
);

export default router;
