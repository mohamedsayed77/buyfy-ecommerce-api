import asyncHandler from "express-async-handler";
import reviewModel from "../models/reviewModel.js";
import ApiError from "../utils/ApiError.js";
import ApiFeatures from "../utils/apiFeatures.js";

/**
 * @description    Create a new review
 * @route          POST /api/v1/reviews
 * @access         Private (User)
 */
const createReview = asyncHandler(async (req, res) => {
  const review = await reviewModel.create(req.body);

  res.status(201).json({
    status: "success",
    message: "Review created successfully.",
    data: review,
  });
});

/**
 * @description    Get a list of reviews with filters, pagination, and sorting
 * @route          GET /api/v1/reviews
 * @access         Public
 */
const getReviews = asyncHandler(async (req, res) => {
  // Count total documents for pagination
  const documentsCount = await reviewModel.countDocuments();

  // Build query features
  const apiFeatures = new ApiFeatures(reviewModel.find(), req.query)
    .paginate(documentsCount)
    .filter(req)
    .sort();

  const { query, paginationResult } = apiFeatures;

  // Execute the query
  const reviews = await query;

  res.status(200).json({
    status: "success",
    results: reviews.length,
    paginationResult,
    data: reviews,
  });
});

/**
 * @description    Get a specific review by ID
 * @route          GET /api/v1/reviews/:id
 * @access         Private (User)
 */
const getReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const review = await reviewModel.findById(id);

  if (!review) {
    return next(new ApiError(`No review found for this ID: ${id}`, 404));
  }

  res.status(200).json({
    status: "success",
    data: review,
  });
});

/**
 * @description    Update a specific review by ID
 * @route          PUT /api/v1/reviews/:id
 * @access         Private (User)
 */
const updateReview = asyncHandler(async (req, res, next) => {
  const review = await reviewModel.findById(req.params.id);

  if (!review) {
    return next(
      new ApiError(`No review found for this ID: ${req.params.id}`, 404)
    );
  }

  // Update review fields and save to trigger the 'save' middleware
  Object.assign(review, req.body);
  await review.save();

  res.status(200).json({
    status: "success",
    message: "Review updated successfully.",
    data: review,
  });
});

/**
 * @description    Delete a specific review by ID
 * @route          DELETE /api/v1/reviews/:id
 * @access         Private (User/Admin)
 */
const deleteReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Find and delete the review
  const review = await reviewModel.findByIdAndDelete(id);

  if (!review) {
    return next(new ApiError(`No review found for this ID: ${id}`, 404));
  }

  // Recalculate ratings for the associated product
  await reviewModel.calcAverageRatingsAndQuantity(review.product);

  res.status(204).json({
    status: "success",
    message: "Review deleted successfully.",
  });
});

export default {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
};
