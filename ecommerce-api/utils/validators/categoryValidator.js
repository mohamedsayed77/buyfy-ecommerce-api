import { check } from "express-validator";
import validatorMiddleware from "../../middleware/validatorMiddleware.js";

const getCategoryValidator = [
  check("id").isMongoId().withMessage("Invaild category id format"),
  validatorMiddleware,
];

const createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category required")
    .isLength({ min: 3 })
    .withMessage("too short category name")
    .isLength({ max: 32 })
    .withMessage("too long category name"),

  validatorMiddleware,
];

const updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invaild category id format"),
  validatorMiddleware,
];

const deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invaild category id format"),
  validatorMiddleware,
];

export default {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
};
