import { check } from "express-validator";

import validatorMiddleware from "../../middleware/validatorMiddleware.js";

import reviewModel from "../../models/reviewModel.js";

const createreviewValidator = [
  check("title").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("ratings is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings value must be between 1 to 5"),
  check("user").isMongoId().withMessage("Invalid review ID format."),
  check("product")
    .isMongoId()
    .withMessage("Invalid review ID format.")
    .custom((val, { req }) =>
      reviewModel
        .findOne({ user: req.user._id, product: req.body.product })
        .then((review) => {
          if (review) {
            return Promise.reject(
              new Error("You have already reviewed this product.")
            );
          }
        })
    ),

  validatorMiddleware,
];

const getreviewValidator = [
  check("id").isMongoId().withMessage("Invalid review ID format."),
  validatorMiddleware,
];

const updatereviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid review ID format.")
    .custom((val, { req }) =>
      reviewModel.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(
            new Error(` No review found for this id ${val}."`)
          );
        }
        if (review.user.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error("You are not authorized to update this review.")
          );
        }
      })
    ),

  validatorMiddleware,
];

const deletereviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid review ID format.")
    .custom((val, { req }) => {
      if (req.user.role === "user") {
        return reviewModel.findById(val).then((review) => {
          if (!review) {
            return Promise.reject(
              new Error(` No review found for this id ${val}."`)
            );
          }
          if (review.user.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new Error("You are not authorized to delete this review.")
            );
          }
        });
      }
    }),
  validatorMiddleware,
];

export default {
  getreviewValidator,
  createreviewValidator,
  updatereviewValidator,
  deletereviewValidator,
};
