import express from "express";
import categoryService from "../services/categoryService.js";

const {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} = categoryService;

const router = express.Router();

router.route("/").get(getCategories).post(createCategory);

router
  .route("/:id")
  .get(getCategory)

  .put(updateCategory)
  .delete(deleteCategory);

export default router;
