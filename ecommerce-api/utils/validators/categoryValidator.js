import { check } from "express-validator";
import slugify from "slugify";
import validatorMiddleware from "../../middleware/validatorMiddleware.js";

const getCategoryValidator = [
  check("id").isMongoId().withMessage("Invaild category id format"),
  validatorMiddleware,
];

const createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category required")
    .isLength({ min: 2 })
    .withMessage("too short category name")
    .isLength({ max: 32 })
    .withMessage("too long category name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  validatorMiddleware,
];

const updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invaild category id format"),
  check("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("too short category name")
    .isLength({ max: 32 })
    .withMessage("too long category name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
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
