import { check } from "express-validator";
import slugify from "slugify";
import validatorMiddleware from "../../middleware/validatorMiddleware.js";
import category from "../../models/categoryModel.js";
import SubCategory from "../../models/subCategoryModel.js";

const getProductValidator = [
  check("id").isMongoId().withMessage("Invaild Product id format"),
  validatorMiddleware,
];

const createProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("Too short product title")
    .notEmpty()
    .withMessage("Product required")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ max: 2000 })
    .withMessage("Product description should not exceed 2000 characters"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold").optional().isNumeric(),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 32 })
    .withMessage("Product price should not exceed 32 characters"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product discounted price must be a number")
    .isFloat()
    .custom((value, { req }) => {
      if (req.body.price < value) {
        throw new Error("Discounted price must be less than to original price");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("available colors should be provided as array of string"),
  check("imageCover").notEmpty().withMessage("product image cover is required"),

  check("images")
    .optional()
    .isArray()
    .withMessage("product images should be provided as array of string"),
  check("category")
    .notEmpty()
    .withMessage("product category is required")
    .isMongoId()
    .withMessage("Invaild category id format")
    .custom((categoryId) =>
      category.findById(categoryId).then((fetchedCategory) => {
        if (!fetchedCategory) {
          return Promise.reject(
            new Error(`No category found for this id ${categoryId}`)
          );
        }
      })
    ),

  check("subCategories")
    .optional()
    .isMongoId()
    .withMessage("Invaild subcategory id format")
    .custom((subCategoriesIds) =>
      SubCategory.find({
        _id: { $exists: true, $in: subCategoriesIds },
      }).then((result) => {
        if (result.length < 1 || result.length !== subCategoriesIds.length) {
          return Promise.reject(new Error(`Invalid subcategories ids`));
        }
      })
    )
    .custom((value, { req }) =>
      SubCategory.find({ category: req.body.category }).then(
        (subCategories) => {
          const subCategoriesIdsInDb = [];
          subCategories.forEach((subCategory) => {
            subCategoriesIdsInDb.push(subCategory._id.toString());
          });
          const checker = (target, arr) => target.every((v) => arr.includes(v));
          if (!checker(value, subCategoriesIdsInDb)) {
            return Promise.reject(
              new Error("subCategories not belong to categoryId ")
            );
          }
        }
      )
    ),
  check("brand").optional().isMongoId().withMessage("Invaild brand id format"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("Product rating average must be a number")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating average must be between 1 and 5"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Product rating quantity must be a number"),

  validatorMiddleware,
];

const updateProductValidator = [
  check("id").isMongoId().withMessage("Invaild Product id format"),
  check("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Too short product title")

    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .optional()

    .isLength({ max: 2000 })
    .withMessage("Product description should not exceed 2000 characters"),
  check("quantity")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold").optional().isNumeric(),
  check("price")
    .optional()
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 32 })
    .withMessage("Product price should not exceed 32 characters"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product discounted price must be a number")
    .isFloat()
    .custom((value, { req }) => {
      if (req.body.price < value) {
        throw new Error("Discounted price must be less than to original price");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("available colors should be provided as array of string"),
  check("imageCover").optional(),

  check("images")
    .optional()
    .isArray()
    .withMessage("product images should be provided as array of string"),
  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invaild category id format")
    .custom((categoryId) =>
      category.findById(categoryId).then((fetchedCategory) => {
        if (!fetchedCategory) {
          return Promise.reject(
            new Error(`No category found for this id ${categoryId}`)
          );
        }
      })
    ),

  check("subCategories")
    .optional()
    .isMongoId()
    .withMessage("Invaild subcategory id format")
    .custom((subCategoriesIds) =>
      SubCategory.find({
        _id: { $exists: true, $in: subCategoriesIds },
      }).then((result) => {
        if (result.length < 1 || result.length !== subCategoriesIds.length) {
          return Promise.reject(new Error(`Invalid subcategories ids`));
        }
      })
    )
    .custom((value, { req }) =>
      SubCategory.find({ category: req.body.category }).then(
        (subCategories) => {
          const subCategoriesIdsInDb = [];
          subCategories.forEach((subCategory) => {
            subCategoriesIdsInDb.push(subCategory._id.toString());
          });
          const checker = (target, arr) => target.every((v) => arr.includes(v));
          if (!checker(value, subCategoriesIdsInDb)) {
            return Promise.reject(
              new Error("subCategories not belong to categoryId ")
            );
          }
        }
      )
    ),
  check("brand").optional().isMongoId().withMessage("Invaild brand id format"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("Product rating average must be a number")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating average must be between 1 and 5"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Product rating quantity must be a number"),
  validatorMiddleware,
];

const deleteProductValidator = [
  check("id").isMongoId().withMessage("Invaild Product id format"),
  validatorMiddleware,
];

export default {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
};
