import { check } from "express-validator";
import slugify from "slugify";
import bcrypt from "bcryptjs";

import validatorMiddleware from "../../middleware/validatorMiddleware.js";
import User from "../../models/userModel.js";

/**
 * Validator for changing the current user's password
 */
const changeMyPasswordValidator = [
  // Validate current password
  check("currentPassword")
    .notEmpty()
    .withMessage("Current password is required.")
    .custom(async (currentPassword, { req }) => {
      const user = await User.findById(req.user._id);
      if (!user) {
        throw new Error("User not found.");
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        throw new Error("Incorrect current password.");
      }
      return true;
    }),

  // Validate new password
  check("password")
    .notEmpty()
    .withMessage("New password is required.")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long.")
    .matches(/\d/)
    .withMessage("New password must contain at least one number.")
    .matches(/[A-Z]/)
    .withMessage("New password must contain at least one uppercase letter.")

    .custom((newPassword, { req }) => {
      if (newPassword === req.body.currentPassword) {
        throw new Error(
          "New password cannot be the same as the current password."
        );
      }
      if (newPassword !== req.body.confirmPassword) {
        throw new Error("New password confirmation does not match.");
      }
      return true;
    }),

  // Validate confirm password
  check("confirmPassword")
    .notEmpty()
    .withMessage("Please confirm your new password."),

  validatorMiddleware,
];

/**
 * Validator for updating the current user's profile
 */
const updateMeValidator = [
  // Validate name
  check("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long.")
    .custom((name, { req }) => {
      req.body.slug = slugify(name); // Generate slug from the name
      return true;
    })
    .custom((name) =>
      User.findOne({ name }).then((user) => {
        if (user) {
          return Promise.reject(
            new Error("This name is already taken. Please choose another.")
          );
        }
      })
    ),

  // Validate email
  check("email")
    .optional()
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .custom((email) =>
      User.findOne({ email }).then((user) => {
        if (user) {
          return Promise.reject(
            new Error("An account with this email already exists.")
          );
        }
      })
    ),

  // Validate profile image (optional)
  check("profileImg").optional(),

  // Validate phone number
  check("phone")
    .optional()
    .isMobilePhone(["en-EG", "ar-EG"])
    .withMessage("Please enter a valid Egyptian phone number."),

  validatorMiddleware,
];

export default {
  changeMyPasswordValidator,
  updateMeValidator,
};
