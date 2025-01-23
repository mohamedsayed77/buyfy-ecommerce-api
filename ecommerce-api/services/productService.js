import expressAsyncHandler from "express-async-handler";
import ProductModel from "../models/productModel.js";
import ApiError from "../utils/ApiError.js";
import ApiFeatures from "../utils/apiFeatures.js";

/**
 * @description    Create a new product
 * @route          POST /api/v1/products
 * @access         Private (Admin/Manager)
 */
const createProduct = expressAsyncHandler(async (req, res) => {
  const product = await ProductModel.create(req.body);

  res.status(201).json({
    status: "success",
    message: "Product created successfully.",
    data: product,
  });
});

/**
 * @description    Get a list of products with filters, pagination, and sorting
 * @route          GET /api/v1/products
 * @access         Public
 */
const getProducts = expressAsyncHandler(async (req, res) => {
  // Count total documents for pagination
  const documentsCount = await ProductModel.countDocuments();

  // Build query features
  const apiFeatures = new ApiFeatures(ProductModel.find(), req.query)
    .paginate(documentsCount)
    .filter()
    .search("products")
    .sort()
    .limitFields();

  // Populate reviews for each product
  apiFeatures.query = apiFeatures.query.populate("reviews");

  const { query, paginationResult } = apiFeatures;

  // Execute the query
  const products = await query;

  res.status(200).json({
    status: "success",
    results: products.length,
    paginationResult,
    data: products,
  });
});

/**
 * @description    Get a specific product by ID
 * @route          GET /api/v1/products/:id
 * @access         Public
 */
const getProduct = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await ProductModel.findById(id).populate("reviews");

  if (!product) {
    return next(new ApiError(`No product found with ID: ${id}`, 404));
  }

  res.status(200).json({
    status: "success",
    data: product,
  });
});

/**
 * @description    Update a specific product by ID
 * @route          PUT /api/v1/products/:id
 * @access         Private (Admin/Manager)
 */
const updateProduct = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await ProductModel.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true, // Ensure validation is applied
  });

  if (!product) {
    return next(new ApiError(`No product found with ID: ${id}`, 404));
  }

  res.status(200).json({
    status: "success",
    message: "Product updated successfully.",
    data: product,
  });
});

/**
 * @description    Delete a specific product by ID
 * @route          DELETE /api/v1/products/:id
 * @access         Private (Admin/Manager)
 */
const deleteProduct = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await ProductModel.findByIdAndDelete(id);

  if (!product) {
    return next(new ApiError(`No product found with ID: ${id}`, 404));
  }

  res.status(204).json({
    status: "success",
    message: "Product deleted successfully.",
  });
});

export default {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
