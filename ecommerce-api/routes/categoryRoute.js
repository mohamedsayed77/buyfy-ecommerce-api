import express from "express";

import categoryService from "../services/categoryService.js";
import categoryValidator from "../utils/validators/categoryValidator.js";
import subCategoriesRoute from "./subCategoryRoute.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";
import resizeImage from "../middleware/imageProcessingMiddleware.js";

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
const router = express.Router();

router.use("/:categoryId/subcategories", subCategoriesRoute);

router
  .route("/")
  .get(getCategories)
  .post(
    uploadSingleImage("image"),
    resizeCategoryImage(),
    createCategoryValidator,
    createCategory
  );

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)

  .put(
    uploadSingleImage("image"),
    resizeCategoryImage(),
    updateCategoryValidator,
    updateCategory
  )
  .delete(deleteCategoryValidator, deleteCategory);

export default router;
