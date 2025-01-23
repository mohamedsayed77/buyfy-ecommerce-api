import { check } from "express-validator";
import slugify from "slugify";

import validatorMiddleware from "../../middleware/validatorMiddleware.js";
import User from "../../models/userModel.js";

/**
 * Validator for creating a new user
 */
const createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long.")
    .custom((val, { req }) => {
      if (val) {
        req.body.slug = slugify(val); // Generate slug from name
        return true;
      }
      return false;
    })
    .custom((val) =>
      User.findOne({ name: val }).then((user) => {
        if (user) {
          return Promise.reject(
            new Error("This name is already taken. Please choose another.")
          );
        }
      })
    ),

  check("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(
            new Error("An account with this email already exists.")
          );
        }
        return true;
      })
    ),

  check("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.")
    .custom((pass, { req }) => {
      if (pass !== req.body.confirmPassword) {
        throw new Error("Passwords do not match. Please try again.");
      }
      return true;
    }),

  check("confirmPassword")
    .notEmpty()
    .withMessage("Password confirmation is required."),

  check("profileImg").optional(), // Profile image is optional
  check("role").optional(), // Role is optional
  check("phone")
    .optional()
    .isMobilePhone("ar-EG")
    .withMessage("Please enter a valid Egyptian phone number."),

  validatorMiddleware,
];

/**
 * Validator for fetching a user by ID
 */
const getUserValidator = [
  check("id").isMongoId().withMessage("Invalid user ID format."),
  validatorMiddleware,
];

/**
 * Validator for updating a user
 */
const updateUserValidator = [
  check("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long.")
    .custom((val, { req }) => {
      req.body.slug = slugify(val); // Generate slug from updated name
      return true;
    })
    .custom((val) =>
      User.findOne({ name: val }).then((user) => {
        if (user) {
          return Promise.reject(
            new Error("This name is already taken. Please choose another.")
          );
        }
      })
    ),

  check("email")
    .optional()
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(
            new Error("An account with this email already exists.")
          );
        }
        return true;
      })
    ),

  check("profileImg").optional(), // Profile image is optional
  check("role").optional(), // Role is optional
  check("phone")
    .optional()
    .isMobilePhone(["en-EG", "ar-EG"])
    .withMessage("Please enter a valid Egyptian phone number."),

  validatorMiddleware,
];

/**
 * Validator for changing a user's password
 */
const changePasswordValidator = [
  check("id").isMongoId().withMessage("Invalid user ID format."),

  check("newPassword")
    .notEmpty()
    .withMessage("New password is required.")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long.")
    .custom((pass, { req }) => {
      if (pass !== req.body.confirmPassword) {
        throw new Error("New password confirmation does not match.");
      }
      return true;
    }),

  check("confirmPassword")
    .notEmpty()
    .withMessage("Password confirmation is required."),

  validatorMiddleware,
];

/**
 * Validator for deleting a user
 */
const deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid user ID format."),
  validatorMiddleware,
];

export default {
  createUserValidator,
  getUserValidator,
  changePasswordValidator,
  updateUserValidator,
  deleteUserValidator,
};
