import express from "express";

import SubCategoryService from "../services/subCategoryService.js";
import SubCategoryValidators from "../utils/validators/subCategoryValidator.js";
import filterByMiddleware from "../middleware/filterByMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

// Destructure necessary utilities and services
const { setCategoryId, filterByCategory } = filterByMiddleware;
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = SubCategoryValidators;
const {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = SubCategoryService;

// Create a new router instance, supporting route parameter merging
const router = express.Router({ mergeParams: true });

/**
 * Route: /api/v1/categories/:categoryId/subcategories or /api/v1/subcategories
 * - GET: Retrieve all subcategories (optionally filtered by category).
 * - POST: Create a new subcategory (requires authentication and admin/manager role).
 */
router
  .route("/")
  .get(filterByCategory, getSubCategories) // Public: Retrieve all subcategories, filtered by category if applicable
  .post(
    authMiddleware.protect, // Authenticate user
    authMiddleware.allowedTo("admin", "manager"), // Restrict to 'admin' and 'manager' roles
    setCategoryId, // Set the category ID in the request body if not already provided
    createSubCategoryValidator, // Validate subcategory creation data
    createSubCategory // Create a new subcategory
  );

/**
 * Route: /api/v1/subcategories/:id
 * - GET: Retrieve a specific subcategory by ID.
 * - PUT: Update a subcategory by ID (requires authentication and admin/manager role).
 * - DELETE: Delete a subcategory by ID (requires authentication and admin/manager role).
 */
router
  .route("/:id")
  .get(
    getSubCategoryValidator, // Validate subcategory ID
    getSubCategory // Retrieve the subcategory
  )
  .put(
    authMiddleware.protect, // Authenticate user
    authMiddleware.allowedTo("admin", "manager"), // Restrict to 'admin' and 'manager' roles
    updateSubCategoryValidator, // Validate subcategory update data
    updateSubCategory // Update the subcategory
  )
  .delete(
    authMiddleware.protect, // Authenticate user
    authMiddleware.allowedTo("admin", "manager"), // Restrict to 'admin' and 'manager' roles
    deleteSubCategoryValidator, // Validate subcategory ID
    deleteSubCategory // Delete the subcategory
  );

export default router;
