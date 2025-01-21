import express from "express";

import SubCategoryService from "../services/subCategoryService.js";
import SubCategoryValidators from "../utils/validators/subCategoryValidator.js";
import subCategoryMiddleware from "../middleware/subCategoryMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

const { setCategoryId, filterByCategory } = subCategoryMiddleware;
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

// Create a new router instance, merging params from parent routers
const router = express.Router({ mergeParams: true });

router
  .route("/")
  // Filter middleware to get subcategories by category and get all subcategories
  .get(filterByCategory, getSubCategories)
  // Set the category ID if not in request body, validate the request, then create subcategory
  .post(
    authMiddleware.protect,
    authMiddleware.allowedTo("admin", "manager"),
    setCategoryId,
    createSubCategoryValidator,
    createSubCategory
  );

// Route to handle subcategory operations by ID
router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(
    authMiddleware.protect,
    authMiddleware.allowedTo("admin", "manager"),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.allowedTo("admin", "manager"),
    deleteSubCategoryValidator,
    deleteSubCategory
  );

export default router;
