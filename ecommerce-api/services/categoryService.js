import expressAsyncHandler from "express-async-handler";

import categoryModel from "../models/categoryModel.js";
import ApiError from "../utils/ApiError.js";
import ApiFeatures from "../utils/apiFeatures.js";

// @description    create a category
// @route          Post  /api/v1/categories
//  @access        Private
const createCategory = expressAsyncHandler(async (req, res) => {
  const category = await categoryModel.create(req.body);
  res.status(201).json({ data: category });
});

// @discussion   Get list of categories
// @route        Get /api/v1/categories
// @access       public
const getCategories = expressAsyncHandler(async (req, res) => {
  // build the query
  const documentsCount = await categoryModel.countDocuments();
  const apiFeatures = new ApiFeatures(categoryModel.find(), req.query)
    .paginate(documentsCount)
    .filter()
    .search();

  const { query, paginationResult } = apiFeatures;

  // execute the query
  const categories = await query;

  res
    .status(200)
    .json({ results: categories.length, paginationResult, data: categories });
});

// @discussion   Get specific category by id
// @route        Get /api/v1/categories/:id
// @access       public
const getCategory = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await categoryModel.findById(id);

  if (!category) {
    return next(new ApiError(`No category for this id ${id}`, 404));
  }

  res.status(200).json({ data: category });
});

// @description    update specific category
// @route          Post  /api/v1/categories/:id
// @access        private
const updateCategory = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await categoryModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });

  if (!category) {
    return next(new ApiError(`No category for this id ${id}`, 404));
  }

  res.status(200).json({ data: category });
});

// @description    delete specific category
// @route          Delete  /api/v1/categories/:id
// @access        private
const deleteCategory = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await categoryModel.findByIdAndDelete(id);

  if (!category) {
    return next(new ApiError(`No category for this id ${id}`, 404));
  }

  res.status(204).send();
});

export default {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
