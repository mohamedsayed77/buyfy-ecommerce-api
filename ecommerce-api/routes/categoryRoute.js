import express from "express";

import categoryService from "../services/categoryService.js";
import categoryValidator from "../utils/validators/categoryValidator.js";
import subCategoriesRoute from "./subCategoryRoute.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";
import resizeImage from "../middleware/imageProcessingMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

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

// Use subcategory routes for specific category ID
router.use("/:categoryId/subcategories", subCategoriesRoute);

// Define routes for categories
router
  .route("/")
  .get(getCategories)
  // Upload image, resize it, validate request, and create a category
  .post(
    authMiddleware.protect,
    authMiddleware.allowedTo("admin", "manger"),
    uploadSingleImage("image"),
    resizeCategoryImage(),
    createCategoryValidator,
    createCategory
  );

// Define routes for a specific category by ID
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)

  // Upload image, resize it, validate request, and update a category by ID
  .put(
    authMiddleware.protect,
    authMiddleware.allowedTo("admin", "manger"),
    uploadSingleImage("image"),
    resizeCategoryImage(),
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.allowedTo("admin", "manger"),
    deleteCategoryValidator,
    deleteCategory
  );

export default router;
