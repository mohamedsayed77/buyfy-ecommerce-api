import expressAsyncHandler from "express-async-handler";
import SubCategoryModel from "../models/subCategoryModel.js";
import ApiError from "../utils/ApiError.js";
import ApiFeatures from "../utils/apiFeatures.js";

/**
 * @description    Create a new subcategory
 * @route          POST /api/v1/subcategories
 * @access         Private (Admin/Manager)
 */
const createSubCategory = expressAsyncHandler(async (req, res) => {
  const subCategory = await SubCategoryModel.create(req.body);

  res.status(201).json({
    status: "success",
    message: "Subcategory created successfully.",
    data: subCategory,
  });
});

/**
 * @description    Get a list of subcategories with filters, pagination, and sorting
 * @route          GET /api/v1/subcategories
 * @access         Public
 */
const getSubCategories = expressAsyncHandler(async (req, res) => {
  // Count total documents for pagination
  const documentsCount = await SubCategoryModel.countDocuments();

  // Build query features
  const apiFeatures = new ApiFeatures(SubCategoryModel.find(), req.query)
    .paginate(documentsCount)
    .filter(req)
    .search()
    .sort()
    .limitFields();

  const { query, paginationResult } = apiFeatures;

  // Execute the query
  const subCategories = await query;

  res.status(200).json({
    status: "success",
    results: subCategories.length,
    paginationResult,
    data: subCategories,
  });
});

/**
 * @description    Get a specific subcategory by ID
 * @route          GET /api/v1/subcategories/:id
 * @access         Public
 */
const getSubCategory = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const subCategory = await SubCategoryModel.findById(id);

  if (!subCategory) {
    return next(new ApiError(`No subcategory found for ID: ${id}`, 404));
  }

  res.status(200).json({
    status: "success",
    data: subCategory,
  });
});

/**
 * @description    Update a specific subcategory by ID
 * @route          PUT /api/v1/subcategories/:id
 * @access         Private (Admin/Manager)
 */
const updateSubCategory = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const subCategory = await SubCategoryModel.findOneAndUpdate(
    { _id: id },
    req.body,
    { new: true }
  );

  if (!subCategory) {
    return next(new ApiError(`No subcategory found for ID: ${id}`, 404));
  }

  res.status(200).json({
    status: "success",
    message: "Subcategory updated successfully.",
    data: subCategory,
  });
});

/**
 * @description    Delete a specific subcategory by ID
 * @route          DELETE /api/v1/subcategories/:id
 * @access         Private (Admin/Manager)
 */
const deleteSubCategory = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const subCategory = await SubCategoryModel.findByIdAndDelete(id);

  if (!subCategory) {
    return next(new ApiError(`No subcategory found for ID: ${id}`, 404));
  }

  res.status(204).json({
    status: "success",
    message: "Subcategory deleted successfully.",
  });
});

export default {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
