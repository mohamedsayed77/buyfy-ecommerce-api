import expressAsyncHandler from "express-async-handler";
import brandModel from "../models/brandModel.js";
import ApiError from "../utils/ApiError.js";
import ApiFeatures from "../utils/apiFeatures.js";

/**
 * @description    Create a new brand
 * @route          POST /api/v1/brands
 * @access         Private (Admin/Manager)
 */
const createBrand = expressAsyncHandler(async (req, res) => {
  const brand = await brandModel.create(req.body);

  res.status(201).json({
    status: "success",
    message: "Brand created successfully.",
    data: brand,
  });
});

/**
 * @description    Get all brands with filters, sorting, and pagination
 * @route          GET /api/v1/brands
 * @access         Public
 */
const getBrands = expressAsyncHandler(async (req, res) => {
  const documentsCount = await brandModel.countDocuments();

  const apiFeatures = new ApiFeatures(brandModel.find(), req.query)
    .paginate(documentsCount)
    .filter()
    .search()
    .sort()
    .limitFields();

  const { query, paginationResult } = apiFeatures;

  const brands = await query;

  res.status(200).json({
    status: "success",
    results: brands.length,
    paginationResult,
    data: brands,
  });
});

/**
 * @description    Get a specific brand by ID
 * @route          GET /api/v1/brands/:id
 * @access         Public
 */
const getBrand = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const brand = await brandModel.findById(id);

  if (!brand) {
    return next(new ApiError(`No brand found with ID ${id}.`, 404));
  }

  res.status(200).json({
    status: "success",
    data: brand,
  });
});

/**
 * @description    Update a specific brand by ID
 * @route          PUT /api/v1/brands/:id
 * @access         Private (Admin/Manager)
 */
const updateBrand = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const brand = await brandModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });

  if (!brand) {
    return next(new ApiError(`No brand found with ID ${id}.`, 404));
  }

  res.status(200).json({
    status: "success",
    message: "Brand updated successfully.",
    data: brand,
  });
});

/**
 * @description    Delete a specific brand by ID
 * @route          DELETE /api/v1/brands/:id
 * @access         Private (Admin/Manager)
 */
const deleteBrand = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const brand = await brandModel.findByIdAndDelete(id);

  if (!brand) {
    return next(new ApiError(`No brand found with ID ${id}.`, 404));
  }

  res.status(204).json({
    status: "success",
    message: "Brand deleted successfully.",
  });
});

export default {
  createBrand,
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
};
