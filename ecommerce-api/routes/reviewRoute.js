import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import reviewValidator from "../utils/validators/reviewValidator.js";
import reviewService from "../services/reviewService.js";

const { createreviewValidator, updatereviewValidator, deletereviewValidator } =
  reviewValidator;
const { getReviews, createReview, getReview, updateReview, deleteReview } =
  reviewService;

// Create a new router instance
const router = express.Router();

router
  .route("/")
  .get(getReviews)

  .post(
    authMiddleware.protect,
    authMiddleware.allowedTo("user"),
    createreviewValidator,
    createReview
  );

router
  .route("/:id")
  .get(authMiddleware.protect, authMiddleware.allowedTo("user"), getReview)

  .put(
    authMiddleware.protect,
    authMiddleware.allowedTo("user"),
    updatereviewValidator,
    updateReview
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.allowedTo("user", "admin"),
    deletereviewValidator,
    deleteReview
  );

export default router;
