import { check } from "express-validator";
import slugify from "slugify";
import validatorMiddleware from "../../middleware/validatorMiddleware.js";

const createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand required")
    .isLength({ min: 2 })
    .withMessage("too short brand name")
    .isLength({ max: 32 })
    .withMessage("too long brand name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  validatorMiddleware,
];

const getBrandValidator = [
  check("id").isMongoId().withMessage("Invaild brand id format"),
  validatorMiddleware,
];

const updateBrandValidator = [
  check("id").isMongoId().withMessage("Invaild brand id format"),
  check("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("too short brand name")
    .isLength({ max: 32 })
    .withMessage("too long brand name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

const deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invaild brand id format"),
  validatorMiddleware,
];

export default {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
};
