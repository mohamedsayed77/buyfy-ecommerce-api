import express from "express";
import categoryService from "../services/categoryService.js";
import categoryValidator from "../utils/validators/categoryValidator.js";

import subCategoriesRoute from "./subCategoryRoute.js";

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
  .post(createCategoryValidator, createCategory);

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)

  .put(updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory);

export default router;
