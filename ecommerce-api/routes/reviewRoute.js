import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import reviewValidator from "../utils/validators/reviewValidator.js";
import reviewService from "../services/reviewService.js";
import filter from "../middleware/filterByMiddleware.js";

// Destructure necessary utilities and services
const { filterByProduct, setProductId } = filter;
const {
  createReviewValidator,
  getReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = reviewValidator;
const { getReviews, createReview, getReview, updateReview, deleteReview } =
  reviewService;

// Create a router instance with support for merging route parameters
const router = express.Router({ mergeParams: true });

/**
 * Route: /api/v1/products/:productId/reviews or /api/v1/reviews
 * - GET: Fetch all reviews, optionally filtered by a specific product.
 * - POST: Create a new review (requires authentication and proper role).
 */
router
  .route("/")
  .get(filterByProduct, getReviews) // Public: Retrieve all reviews (filter by product if applicable)
  .post(
    authMiddleware.protect, // Authenticate user
    authMiddleware.allowedTo("user", "admin"), // Restrict to 'user' or 'admin' roles
    setProductId, // Set the product ID in the request body if provided in the URL
    createReviewValidator, // Validate the review data
    createReview // Create a new review
  );

/**
 * Route: /api/v1/reviews/:id
 * - GET: Fetch a specific review by ID (requires authentication).
 * - PUT: Update a review by ID (requires authentication and proper role).
 * - DELETE: Delete a review by ID (requires authentication and proper role).
 */
router
  .route("/:id")
  .get(
    authMiddleware.protect, // Authenticate user
    authMiddleware.allowedTo("user", "admin"), // Restrict to 'user' or 'admin' roles
    getReviewValidator, // Validate the review ID
    getReview // Fetch the review
  )
  .put(
    authMiddleware.protect, // Authenticate user
    authMiddleware.allowedTo("user", "admin"), // Restrict to 'user' or 'admin' roles
    updateReviewValidator, // Validate the review data
    updateReview // Update the review
  )
  .delete(
    authMiddleware.protect, // Authenticate user
    authMiddleware.allowedTo("user", "admin"), // Restrict to 'user' or 'admin' roles
    deleteReviewValidator, // Validate the review ID
    deleteReview // Delete the review
  );

export default router;
