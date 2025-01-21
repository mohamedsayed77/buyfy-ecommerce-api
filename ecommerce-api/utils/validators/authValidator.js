import { check } from "express-validator";
import slugify from "slugify";

import validatorMiddleware from "../../middleware/validatorMiddleware.js";
import User from "../../models/userModel.js";

// Validator for creating a new user
const signupValidator = [
  check("name")
    .notEmpty()
    .withMessage("Please provide your name.")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long.")
    .custom((val, { req }) => {
      if (val) {
        req.body.slug = slugify(val);
      }

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
    .withMessage("Please confirm your password."),

  validatorMiddleware,
];

const loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please enter a valid email address."),

  check("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),

  validatorMiddleware,
];
const forgetPaswordValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (!user) {
          return Promise.reject(new Error("No user found with this email."));
        }
        return true;
      })
    ),

  validatorMiddleware,
];

export default {
  signupValidator,
  loginValidator,

  forgetPaswordValidator,
};
