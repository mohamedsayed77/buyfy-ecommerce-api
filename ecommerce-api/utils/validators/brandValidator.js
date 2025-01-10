import { check } from "express-validator";

import validatorMiddleware from "../../middleware/validatorMiddleware.js";

const getBrandValidator = [
  check("id").isMongoId().withMessage("Invaild brand id format"),
  validatorMiddleware,
];

const createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand required")
    .isLength({ min: 2 })
    .withMessage("too short brand name")
    .isLength({ max: 32 })
    .withMessage("too long brand name"),

  validatorMiddleware,
];

const updateBrandValidator = [
  check("id").isMongoId().withMessage("Invaild brand id format"),
  check("name").optional(),
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
