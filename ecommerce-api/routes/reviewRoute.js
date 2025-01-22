import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import reviewValidator from "../utils/validators/reviewValidator.js";
import reviewService from "../services/reviewService.js";
import filter from "../middleware/filterByMiddleware.js";

const { filterByProduct, setProductId } = filter;

const {
  createReviewValidator,
  getReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = reviewValidator;
const { getReviews, createReview, getReview, updateReview, deleteReview } =
  reviewService;

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(filterByProduct, getReviews)

  .post(
    authMiddleware.protect,
    authMiddleware.allowedTo("user", "admin"),
    setProductId,
    createReviewValidator,
    createReview
  );

router
  .route("/:id")
  .get(
    authMiddleware.protect,
    authMiddleware.allowedTo("user", "admin"),
    getReviewValidator,
    getReview
  )

  .put(
    authMiddleware.protect,
    authMiddleware.allowedTo("user", "admin"),
    updateReviewValidator,
    updateReview
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.allowedTo("user", "admin"),
    deleteReviewValidator,
    deleteReview
  );

export default router;
