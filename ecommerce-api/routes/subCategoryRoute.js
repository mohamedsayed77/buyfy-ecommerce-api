import express from "express";
import SubCategoryService from "../services/subCategoryService.js";
import SubCategoryValidators from "../utils/validators/subCategoryValidator.js";

const { createSubCategoryValidator } = SubCategoryValidators;

const { createSubCategory } = SubCategoryService;

const router = express.Router();

router.route("/").post(createSubCategoryValidator, createSubCategory);

export default router;
