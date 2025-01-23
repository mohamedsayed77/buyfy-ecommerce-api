import { check } from "express-validator";
import slugify from "slugify";
import validatorMiddleware from "../../middleware/validatorMiddleware.js";
import Category from "../../models/categoryModel.js";
import SubCategory from "../../models/subCategoryModel.js";

/**
 * Validator for fetching a product by ID
 */
const getProductValidator = [
  check("id").isMongoId().withMessage("Invalid product ID format."),
  validatorMiddleware,
];

/**
 * Validator for creating a new product
 */
const createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Product title is required.")
    .isLength({ min: 3 })
    .withMessage("Product title must be at least 3 characters long.")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("Product description is required.")
    .isLength({ max: 2000 })
    .withMessage("Product description should not exceed 2000 characters."),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required.")
    .isNumeric()
    .withMessage("Product quantity must be a number."),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Sold quantity must be a number."),
  check("price")
    .notEmpty()
    .withMessage("Product price is required.")
    .isNumeric()
    .withMessage("Product price must be a number.")
    .isLength({ max: 32 })
    .withMessage("Product price should not exceed 32 characters."),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Discounted price must be a number.")
    .custom((value, { req }) => {
      if (req.body.price && value >= req.body.price) {
        throw new Error(
          "Discounted price must be less than the original price."
        );
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("Colors should be provided as an array."),
  check("imageCover")
    .notEmpty()
    .withMessage("Product image cover is required."),
  check("images")
    .optional()
    .isArray()
    .withMessage("Product images should be provided as an array."),
  check("category")
    .notEmpty()
    .withMessage("Product category is required.")
    .isMongoId()
    .withMessage("Invalid category ID format.")
    .custom(async (categoryId) => {
      const category = await Category.findById(categoryId);
      if (!category) {
        throw new Error(`No category found for this ID: ${categoryId}`);
      }
    }),
  check("subCategories")
    .optional()
    .isArray()
    .withMessage("Subcategories should be provided as an array.")
    .custom(async (subCategoryIds, { req }) => {
      const subCategories = await SubCategory.find({
        _id: { $in: subCategoryIds },
        category: req.body.category,
      });

      if (subCategories.length !== subCategoryIds.length) {
        throw new Error(
          "Some subcategories do not belong to the specified category."
        );
      }
    }),
  check("brand").optional().isMongoId().withMessage("Invalid brand ID format."),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("Ratings average must be a number.")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings average must be between 1 and 5."),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Ratings quantity must be a number."),
  validatorMiddleware,
];

/**
 * Validator for updating an existing product
 */
const updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid product ID format."),
  check("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Product title must be at least 3 characters long.")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .optional()
    .isLength({ max: 2000 })
    .withMessage("Product description should not exceed 2000 characters."),
  check("quantity")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number."),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Sold quantity must be a number."),
  check("price")
    .optional()
    .isNumeric()
    .withMessage("Product price must be a number.")
    .isLength({ max: 32 })
    .withMessage("Product price should not exceed 32 characters."),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Discounted price must be a number.")
    .custom((value, { req }) => {
      if (req.body.price && value >= req.body.price) {
        throw new Error(
          "Discounted price must be less than the original price."
        );
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("Colors should be provided as an array."),
  check("imageCover").optional(),
  check("images")
    .optional()
    .isArray()
    .withMessage("Product images should be provided as an array."),
  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid category ID format.")
    .custom(async (categoryId) => {
      const category = await Category.findById(categoryId);
      if (!category) {
        throw new Error(`No category found for this ID: ${categoryId}`);
      }
    }),
  check("subCategories")
    .optional()
    .isArray()
    .withMessage("Subcategories should be provided as an array.")
    .custom(async (subCategoryIds, { req }) => {
      const subCategories = await SubCategory.find({
        _id: { $in: subCategoryIds },
        category: req.body.category,
      });

      if (subCategories.length !== subCategoryIds.length) {
        throw new Error(
          "Some subcategories do not belong to the specified category."
        );
      }
    }),
  check("brand").optional().isMongoId().withMessage("Invalid brand ID format."),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("Ratings average must be a number.")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings average must be between 1 and 5."),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Ratings quantity must be a number."),
  validatorMiddleware,
];

/**
 * Validator for deleting a product by ID
 */
const deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid product ID format."),
  validatorMiddleware,
];

export default {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
};
