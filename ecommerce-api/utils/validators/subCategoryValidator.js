import { check } from "express-validator";
import validatorMiddleware from "../../middleware/validatorMiddleware.js";
import categoryModel from "../../models/categoryModel.js";

const createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory name is required")
    .isLength({ min: 3 })
    .withMessage("too short Subcategory name")
    .isLength({ max: 32 })
    .withMessage("too long Subcategory name"),

  check("category")
    .notEmpty()
    .withMessage("Category required")
    .isMongoId()
    .withMessage("Invaild category id format")
    .custom((categoryId) => {
      if (!categoryId) {
        return true; // Skip further validation if 'categoryId' is not provided
      }
      return categoryModel.findById(categoryId).then((fetchedCategory) => {
        if (!fetchedCategory) {
          return Promise.reject(
            new Error(`No category found for this ID ${categoryId}`)
          );
        }
      });
    }),

  validatorMiddleware,
];
const getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invaild subCategory id format"),
  validatorMiddleware,
];

const updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invaild subCategory id format"),
  check("name")
    .isLength({ min: 3 })
    .withMessage("too short Subcategory name")
    .isLength({ max: 32 })
    .withMessage("too long Subcategory name"),
  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invaild category id format")
    .custom((categoryId) =>
      categoryModel.findById(categoryId).then((fetchedCategory) => {
        if (!fetchedCategory) {
          return Promise.reject(
            new Error(`No category found for this id ${categoryId}`)
          );
        }
      })
    ),
  validatorMiddleware,
];

const deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invaild subCategory id format"),
  validatorMiddleware,
];

export default {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
};
