import { check } from "express-validator";
import slugify from "slugify";
import validatorMiddleware from "../../middleware/validatorMiddleware.js";
import category from "../../models/categoryModel.js";
import SubCategory from "../../models/subCategoryModel.js";

const getProductValidator = [
  check("id").isMongoId().withMessage("Invalid product ID format."),
  validatorMiddleware,
];

const createProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("Product title must be at least 3 characters long.")
    .notEmpty()
    .withMessage("Product title is required.")
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
      if (req.body.price < value) {
        throw new Error(
          "Discounted price must be less than the original price."
        );
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("Available colors should be provided as an array of strings."),
  check("imageCover")
    .notEmpty()
    .withMessage("Product image cover is required."),
  check("images")
    .optional()
    .isArray()
    .withMessage("Product images should be provided as an array of strings."),
  check("category")
    .notEmpty()
    .withMessage("Product category is required.")
    .isMongoId()
    .withMessage("Invalid category ID format.")
    .custom((categoryId) =>
      category.findById(categoryId).then((fetchedCategory) => {
        if (!fetchedCategory) {
          return Promise.reject(
            new Error(`No category found for this ID: ${categoryId}`)
          );
        }
      })
    ),
  check("subCategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid subcategory ID format.")
    .custom((subCategoriesIds) =>
      SubCategory.find({
        _id: { $exists: true, $in: subCategoriesIds },
      }).then((result) => {
        if (result.length < 1 || result.length !== subCategoriesIds.length) {
          return Promise.reject(new Error("Invalid subcategory IDs."));
        }
      })
    )
    .custom((value, { req }) =>
      SubCategory.find({ category: req.body.category }).then(
        (subCategories) => {
          const subCategoriesIdsInDb = subCategories.map((subCategory) =>
            subCategory._id.toString()
          );
          const checker = (target, arr) => target.every((v) => arr.includes(v));
          if (!checker(value, subCategoriesIdsInDb)) {
            return Promise.reject(
              new Error(
                "Some subcategories do not belong to the specified category."
              )
            );
          }
        }
      )
    ),
  check("brand").optional().isMongoId().withMessage("Invalid brand ID format."),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("Product rating average must be a number.")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating average must be between 1 and 5."),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Product rating quantity must be a number."),
  validatorMiddleware,
];

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
      if (req.body.price < value) {
        throw new Error(
          "Discounted price must be less than the original price."
        );
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("Available colors should be provided as an array of strings."),
  check("imageCover").optional(),
  check("images")
    .optional()
    .isArray()
    .withMessage("Product images should be provided as an array of strings."),
  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid category ID format.")
    .custom((categoryId) =>
      category.findById(categoryId).then((fetchedCategory) => {
        if (!fetchedCategory) {
          return Promise.reject(
            new Error(`No category found for this ID: ${categoryId}`)
          );
        }
      })
    ),
  check("subCategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid subcategory ID format.")
    .custom((subCategoriesIds) =>
      SubCategory.find({
        _id: { $exists: true, $in: subCategoriesIds },
      }).then((result) => {
        if (result.length < 1 || result.length !== subCategoriesIds.length) {
          return Promise.reject(new Error("Invalid subcategory IDs."));
        }
      })
    )
    .custom((value, { req }) =>
      SubCategory.find({ category: req.body.category }).then(
        (subCategories) => {
          const subCategoriesIdsInDb = subCategories.map((subCategory) =>
            subCategory._id.toString()
          );
          const checker = (target, arr) => target.every((v) => arr.includes(v));
          if (!checker(value, subCategoriesIdsInDb)) {
            return Promise.reject(
              new Error(
                "Some subcategories do not belong to the specified category."
              )
            );
          }
        }
      )
    ),
  check("brand").optional().isMongoId().withMessage("Invalid brand ID format."),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("Product rating average must be a number.")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating average must be between 1 and 5."),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Product rating quantity must be a number."),
  validatorMiddleware,
];

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
