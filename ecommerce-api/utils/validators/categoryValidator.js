import { check } from "express-validator";
import slugify from "slugify";
import validatorMiddleware from "../../middleware/validatorMiddleware.js";

const getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category ID format."),
  validatorMiddleware,
];

const createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name is required.")
    .isLength({ min: 2 })
    .withMessage("Category name must be at least 2 characters long.")
    .isLength({ max: 32 })
    .withMessage("Category name must be at most 32 characters long.")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  validatorMiddleware,
];

const updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category ID format."),
  check("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Category name must be at least 2 characters long.")
    .isLength({ max: 32 })
    .withMessage("Category name must be at most 32 characters long.")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

const deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category ID format."),
  validatorMiddleware,
];

export default {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
};
