import express from "express";

import categoryService from "../services/categoryService.js";
import categoryValidator from "../utils/validators/categoryValidator.js";
import subCategoriesRoute from "./subCategoryRoute.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";
import resizeImage from "../middleware/imageProcessingMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

// Destructure necessary methods and middleware
const { uploadSingleImage } = uploadMiddleware;
const { resizeCategoryImage } = resizeImage;
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = categoryValidator;
const {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} = categoryService;

// Create a new router instance
const router = express.Router();

/**
 * Nested Routes: Subcategories
 * - Handles routes like `/api/v1/categories/:categoryId/subcategories`.
 * - Delegates subcategory logic to `subCategoryRoute`.
 */
router.use("/:categoryId/subcategories", subCategoriesRoute);

/**
 * Route: /api/v1/categories/
 * - GET: Retrieve all categories.
 * - POST: Create a new category (Admin or Manager only).
 *   - Requires image upload and resizing.
 *   - Validates the request body.
 */
router
  .route("/")
  .get(getCategories) // Public route to fetch all categories
  .post(
    authMiddleware.protect, // Ensure the user is authenticated
    authMiddleware.allowedTo("admin", "manager"), // Restrict access to admin and manager roles
    uploadSingleImage("image"), // Middleware to upload a single category image
    resizeCategoryImage(), // Resize the uploaded category image
    createCategoryValidator, // Validate the request body
    createCategory // Handle category creation
  );

/**
 * Route: /api/v1/categories/:id
 * - GET: Retrieve a specific category by its ID.
 * - PUT: Update a specific category by its ID (Admin or Manager only).
 *   - Requires image upload and resizing.
 *   - Validates the request body.
 * - DELETE: Remove a specific category by its ID (Admin or Manager only).
 */
router
  .route("/:id")
  .get(getCategoryValidator, getCategory) // Fetch a specific category by ID
  .put(
    authMiddleware.protect, // Ensure the user is authenticated
    authMiddleware.allowedTo("admin", "manager"), // Restrict access to admin and manager roles
    uploadSingleImage("image"), // Middleware to upload a single category image
    resizeCategoryImage(), // Resize the uploaded category image
    updateCategoryValidator, // Validate the request body
    updateCategory // Handle category update
  )
  .delete(
    authMiddleware.protect, // Ensure the user is authenticated
    authMiddleware.allowedTo("admin", "manager"), // Restrict access to admin and manager roles
    deleteCategoryValidator, // Validate the category ID
    deleteCategory // Handle category deletion
  );

export default router;
