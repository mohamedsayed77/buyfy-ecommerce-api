import asyncHandler from "express-async-handler";

import reviewModel from "../models/reviewModel.js";
import ApiError from "../utils/ApiError.js";
import ApiFeatures from "../utils/apiFeatures.js";

// @description    create a Review
// @route          Post  /api/v1/reviews
//  @access        pivate/protected/User
const createReview = asyncHandler(async (req, res) => {
  const review = await reviewModel.create(req.body);
  res.status(201).json({ data: review });
});

// @discussion   Get list of Reviews
// @route        Get /api/v1/Reviews
// @access       public
const getReviews = asyncHandler(async (req, res) => {
  // build the query
  const documentsCount = await reviewModel.countDocuments();
  const apiFeatures = new ApiFeatures(reviewModel.find(), req.query)
    .paginate(documentsCount)
    .filter(req)
    .sort();
  const { query, paginationResult } = apiFeatures;

  // execute the query
  const reviews = await query;

  res
    .status(200)
    .json({ results: reviews.length, paginationResult, data: reviews });
});

// @discussion   Get specific Review by id
// @route        Get /api/v1/Reviews/:id
// @access       pivate/protected/User
const getReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const review = await reviewModel.findById(id);

  if (!review) {
    return next(new ApiError(`No Review for this id ${id}`, 404));
  }

  res.status(200).json({ data: review });
});

// @description    update specific review
// @route          Post  /api/v1/reviews/:id
// @access         pivate/protected/User
const updateReview = asyncHandler(async (req, res, next) => {
  const review = await reviewModel.findById(req.params.id);

  if (!review) {
    return next(
      new ApiError(`No review found for this id ${req.params.id}`, 404)
    );
  }

  // Update review fields and save to trigger the 'save' middleware
  Object.assign(review, req.body);
  await review.save();

  res.status(200).json({ data: review });
});

// @description    delete specific review
// @route          Delete  /api/v1/reviews/:id
// @access         pivate/protected/User-Admin
const deleteReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Find and delete the review
  const review = await reviewModel.findByIdAndDelete(id);

  if (!review) {
    return next(new ApiError(`No review found for this id ${id}`, 404));
  }

  // Recalculate ratings for the associated product
  await reviewModel.calcAverageRatingsAndQuantity(review.product);

  res.status(204).send();
});

export default {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
};
