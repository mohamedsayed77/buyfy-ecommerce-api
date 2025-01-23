import { check } from "express-validator";
import validatorMiddleware from "../../middleware/validatorMiddleware.js";
import Review from "../../models/reviewModel.js";

/**
 * Validator for creating a new review.
 * Ensures ratings are within range, the product and user IDs are valid, and the user hasn't already reviewed the product.
 */
const createReviewValidator = [
  check("title").optional(), // Title is optional for reviews
  check("ratings")
    .notEmpty()
    .withMessage("Ratings value is required.")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings value must be between 1 and 5."),
  check("user").isMongoId().withMessage("Invalid user ID format."),
  check("product")
    .isMongoId()
    .withMessage("Invalid product ID format.")
    .custom((val, { req }) => {
      if (req.user.role === "admin") {
        return true; // Admins can bypass duplicate review checks
      }
      // Check if the logged-in user has already reviewed the product
      return Review.findOne({
        user: req.user._id,
        product: req.body.product,
      }).then((review) => {
        if (review) {
          return Promise.reject(
            new Error("You have already created a review for this product.")
          );
        }
      });
    }),
  validatorMiddleware,
];

/**
 * Validator for fetching a review by its ID.
 */
const getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid review ID format."),
  validatorMiddleware,
];

/**
 * Validator for updating a review.
 * Ensures the user owns the review or has the admin role.
 */
const updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid review ID format.")
    .custom((val, { req }) => {
      if (req.user.role === "admin") {
        return true; // Admins can update any review
      }
      // Check if the logged-in user is the owner of the review
      return Review.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(new Error(`No review found with ID ${val}.`));
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error("You are not authorized to update this review.")
          );
        }
      });
    }),
  validatorMiddleware,
];

/**
 * Validator for deleting a review.
 * Ensures the user owns the review or has the admin role.
 */
const deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid review ID format.")
    .custom((val, { req }) => {
      if (req.user.role === "admin") {
        return true; // Admins can delete any review
      }
      // Check if the logged-in user is the owner of the review
      return Review.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(new Error(`No review found with ID ${val}.`));
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error("You are not authorized to delete this review.")
          );
        }
      });
    }),
  validatorMiddleware,
];

export default {
  createReviewValidator,
  getReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
};
