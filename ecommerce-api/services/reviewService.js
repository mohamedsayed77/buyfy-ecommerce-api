import expressAsyncHandler from "express-async-handler";

import ReviewModel from "../models/reviewModel.js";
import ApiError from "../utils/ApiError.js";
import ApiFeatures from "../utils/apiFeatures.js";

// @description    create a Review
// @route          Post  /api/v1/reviews
//  @access        pivate/protected/User
const createReview = expressAsyncHandler(async (req, res) => {
  const review = await ReviewModel.create(req.body);
  res.status(201).json({ data: review });
});

// @discussion   Get list of Reviews
// @route        Get /api/v1/Reviews
// @access       public
const getReviews = expressAsyncHandler(async (req, res) => {
  // build the query
  const documentsCount = await ReviewModel.countDocuments();
  const apiFeatures = new ApiFeatures(ReviewModel.find(), req.query)
    .paginate(documentsCount)
    .filter()
    .search()
    .sort()
    .limitFields();

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
const getReview = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const review = await ReviewModel.findById(id);

  if (!review) {
    return next(new ApiError(`No Review for this id ${id}`, 404));
  }

  res.status(200).json({ data: review });
});

// @description    update specific review
// @route          Post  /api/v1/reviews/:id
// @access         pivate/protected/User
const updateReview = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const review = await ReviewModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });

  if (!review) {
    return next(new ApiError(`No review for this id ${id}`, 404));
  }

  res.status(200).json({ data: review });
});

// @description    delete specific review
// @route          Delete  /api/v1/reviews/:id
// @access         pivate/protected/User-Admin
const deleteReview = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const review = await ReviewModel.findByIdAndDelete(id);

  if (!review) {
    return next(new ApiError(`No review for this id ${id}`, 404));
  }

  res.status(204).send();
});

export default {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
};
