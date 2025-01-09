import express from "express";
import SubCategoryService from "../services/subCategoryService.js";
import SubCategoryValidators from "../utils/validators/subCategoryValidator.js";

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

const router = express.Router();

router
  .route("/")
  .get(getSubCategories)
  .post(createSubCategoryValidator, createSubCategory);

router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory);

export default router;
