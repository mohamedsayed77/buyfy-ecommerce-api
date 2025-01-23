import { check } from "express-validator";
import slugify from "slugify";
import validatorMiddleware from "../../middleware/validatorMiddleware.js";

/**
 * Validator for fetching a category by ID
 */
const getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category ID format."), // Ensures the ID is a valid MongoDB ObjectId
  validatorMiddleware, // Middleware to handle validation results
];

/**
 * Validator for creating a new category
 */
const createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name is required.") // Checks if the name field is provided
    .isLength({ min: 2 })
    .withMessage("Category name must be at least 2 characters long.") // Validates the minimum length
    .isLength({ max: 32 })
    .withMessage("Category name must be at most 32 characters long.") // Validates the maximum length
    .custom((val, { req }) => {
      req.body.slug = slugify(val); // Automatically generate a slug for the category name
      return true;
    }),
  validatorMiddleware,
];

/**
 * Validator for updating a category by ID
 */
const updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category ID format."), // Ensures the ID is valid
  check("name")
    .optional() // The name field is optional for updates
    .isLength({ min: 2 })
    .withMessage("Category name must be at least 2 characters long.") // Validates minimum length if provided
    .isLength({ max: 32 })
    .withMessage("Category name must be at most 32 characters long.") // Validates maximum length if provided
    .custom((val, { req }) => {
      req.body.slug = slugify(val); // Automatically generate a slug for the category name
      return true;
    }),
  validatorMiddleware,
];

/**
 * Validator for deleting a category by ID
 */
const deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category ID format."), // Ensures the ID is valid
  validatorMiddleware,
];

export default {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
};
