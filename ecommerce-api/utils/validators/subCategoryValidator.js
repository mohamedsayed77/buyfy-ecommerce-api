import { check } from "express-validator";
import slugify from "slugify";
import validatorMiddleware from "../../middleware/validatorMiddleware.js";
import categoryModel from "../../models/categoryModel.js";

const createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Subcategory name is required.")
    .isLength({ min: 2 })
    .withMessage("Subcategory name must be at least 2 characters long.")
    .isLength({ max: 32 })
    .withMessage("Subcategory name must be at most 32 characters long.")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("Category is required.")
    .isMongoId()
    .withMessage("Invalid category ID format.")
    .custom((categoryId) =>
      categoryModel.findById(categoryId).then((fetchedCategory) => {
        if (!fetchedCategory) {
          return Promise.reject(
            new Error(`No category found for this ID: ${categoryId}`)
          );
        }
      })
    ),
  validatorMiddleware,
];

const getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subcategory ID format."),
  validatorMiddleware,
];

const updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subcategory ID format."),
  check("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Subcategory name must be at least 2 characters long.")
    .isLength({ max: 32 })
    .withMessage("Subcategory name must be at most 32 characters long.")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid category ID format.")
    .custom((categoryId) =>
      categoryModel.findById(categoryId).then((fetchedCategory) => {
        if (!fetchedCategory) {
          return Promise.reject(
            new Error(`No category found for this ID: ${categoryId}`)
          );
        }
      })
    ),
  validatorMiddleware,
];

const deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subcategory ID format."),
  validatorMiddleware,
];

export default {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
};
