import express from "express";
import categoryService from "../services/categoryService.js";
import categoryValidator from "../utils/validators/categoryValidator.js";

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
