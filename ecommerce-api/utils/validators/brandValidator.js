import { check } from "express-validator";
import slugify from "slugify";
import validatorMiddleware from "../../middleware/validatorMiddleware.js";

/**
 * Validator for creating a new brand
 */
const createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand name is required.")
    .isLength({ min: 2 })
    .withMessage("Brand name must be at least 2 characters long.")
    .isLength({ max: 32 })
    .withMessage("Brand name must be at most 32 characters long.")
    .custom((val, { req }) => {
      req.body.slug = slugify(val); // Generate a slug from the brand name
      return true;
    }),
  validatorMiddleware, // Middleware to handle validation results
];

/**
 * Validator for fetching a brand by ID
 */
const getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand ID format."), // Ensure the provided ID is in valid MongoDB format
  validatorMiddleware,
];

/**
 * Validator for updating a brand by ID
 */
const updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand ID format."), // Validate the ID format
  check("name")
    .optional() // Brand name is optional for updates
    .isLength({ min: 2 })
    .withMessage("Brand name must be at least 2 characters long.")
    .isLength({ max: 32 })
    .withMessage("Brand name must be at most 32 characters long.")
    .custom((val, { req }) => {
      req.body.slug = slugify(val); // Generate a slug from the brand name
      return true;
    }),
  validatorMiddleware,
];

/**
 * Validator for deleting a brand by ID
 */
const deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand ID format."), // Ensure the ID is in valid MongoDB format
  validatorMiddleware,
];

export default {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
};
