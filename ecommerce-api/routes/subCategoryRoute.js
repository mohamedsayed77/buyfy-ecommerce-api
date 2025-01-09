import express from "express";
import SubCategoryService from "../services/subCategoryService.js";
import SubCategoryValidators from "../utils/validators/subCategoryValidator.js";

const { createSubCategoryValidator, getSubCategoryValidator } =
  SubCategoryValidators;

const { createSubCategory, getSubCategories, getSubCategory } =
  SubCategoryService;

const router = express.Router();

router
  .route("/")
  .get(getSubCategories)
  .post(createSubCategoryValidator, createSubCategory);

router.route("/:id").get(getSubCategoryValidator, getSubCategory);

export default router;
