import expressAsyncHandler from "express-async-handler";
import categoryModel from "../models/categoryModel.js";
import ApiError from "../utils/ApiError.js";
import ApiFeatures from "../utils/apiFeatures.js";

/**
 * @description    Create a new category
 * @route          POST /api/v1/categories
 * @access         Private (Admin/Manager)
 */
const createCategory = expressAsyncHandler(async (req, res) => {
  const category = await categoryModel.create(req.body);

  res.status(201).json({
    status: "success",
    message: "Category created successfully.",
    data: category,
  });
});

/**
 * @description    Get all categories with filters, sorting, and pagination
 * @route          GET /api/v1/categories
 * @access         Public
 */
const getCategories = expressAsyncHandler(async (req, res) => {
  const documentsCount = await categoryModel.countDocuments();

  const apiFeatures = new ApiFeatures(categoryModel.find(), req.query)
    .paginate(documentsCount)
    .filter()
    .search()
    .sort()
    .limitFields();

  const { query, paginationResult } = apiFeatures;

  const categories = await query;

  res.status(200).json({
    status: "success",
    results: categories.length,
    paginationResult,
    data: categories,
  });
});

/**
 * @description    Get a specific category by ID
 * @route          GET /api/v1/categories/:id
 * @access         Public
 */
const getCategory = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await categoryModel.findById(id);

  if (!category) {
    return next(new ApiError(`No category found with ID ${id}.`, 404));
  }

  res.status(200).json({
    status: "success",
    data: category,
  });
});

/**
 * @description    Update a specific category by ID
 * @route          PUT /api/v1/categories/:id
 * @access         Private (Admin/Manager)
 */
const updateCategory = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await categoryModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });

  if (!category) {
    return next(new ApiError(`No category found with ID ${id}.`, 404));
  }

  res.status(200).json({
    status: "success",
    message: "Category updated successfully.",
    data: category,
  });
});

/**
 * @description    Delete a specific category by ID
 * @route          DELETE /api/v1/categories/:id
 * @access         Private (Admin/Manager)
 */
const deleteCategory = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await categoryModel.findByIdAndDelete(id);

  if (!category) {
    return next(new ApiError(`No category found with ID ${id}.`, 404));
  }

  res.status(204).json({
    status: "success",
    message: "Category deleted successfully.",
  });
});

export default {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
