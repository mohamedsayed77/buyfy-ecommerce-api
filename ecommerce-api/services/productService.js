import expressAsyncHandler from "express-async-handler";
import ProductModel from "../models/productModel.js";
import ApiError from "../utils/ApiError.js";
import ApiFeatures from "../utils/apiFeatures.js";

// @description    create a product
// @route          Post  /api/v1/products
//  @access        Private
const createProduct = expressAsyncHandler(async (req, res) => {
  const product = await ProductModel.create(req.body);
  res.status(201).json({ data: product });
});

// @discussion   Get list of products
// @route        Get /api/v1/products
// @access       public
const getProducts = expressAsyncHandler(async (req, res) => {
  // build the query
  const documentsCount = await ProductModel.countDocuments();
  const apiFeatures = new ApiFeatures(ProductModel.find(), req.query)
    .paginate(documentsCount)
    .filter()
    .search("products")
    .sort()
    .limitFields();

  const { query, paginationResult } = apiFeatures;

  // execute the query
  const products = await query;

  res
    .status(200)
    .json({ results: products.length, paginationResult, data: products });
});

// @discussion   Get specific product by id
// @route        Get /api/v1/products/:id
// @access       public
const getProduct = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await ProductModel.findById(id);

  if (!product) {
    return next(new ApiError(`No product for this id ${id}`, 404));
  }

  res.status(200).json({ data: product });
});
// @description    update specific product
// @route          Post  /api/v1/products/:id
// @access        private
const updateProduct = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await ProductModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });

  if (!product) {
    // return res.status(404).json({ message: 'Category not found' });
    return next(new ApiError(`No product for this id ${id}`, 404));
  }

  res.status(200).json({ data: product });
});

// @description    delete specific product
// @route          Delete  /api/v1/products/:id
// @access        private
const deleteProduct = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await ProductModel.findByIdAndDelete(id);

  if (!product) {
    // return res.status(404).json({ message: 'Category not found' });
    return next(new ApiError(`No product for this id ${id}`, 404));
  }

  res.status(204).send();
});

export default {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
