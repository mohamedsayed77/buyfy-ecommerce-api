import { check } from "express-validator";
import slugify from "slugify";
import validatorMiddleware from "../../middleware/validatorMiddleware.js";

const createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand name is required.")
    .isLength({ min: 2 })
    .withMessage("Brand name must be at least 2 characters long.")
    .isLength({ max: 32 })
    .withMessage("Brand name must be at most 32 characters long.")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  validatorMiddleware,
];

const getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand ID format."),
  validatorMiddleware,
];

const updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand ID format."),
  check("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Brand name must be at least 2 characters long.")
    .isLength({ max: 32 })
    .withMessage("Brand name must be at most 32 characters long.")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

const deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand ID format."),
  validatorMiddleware,
];

export default {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
};
