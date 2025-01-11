import expressAsyncHandler from "express-async-handler";
import ProductModel from "../models/productModel.js";
import ApiError from "../utils/ApiError.js";

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
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  const products = await ProductModel.find().skip(skip).limit(limit);

  res.status(200).json({ results: products.length, page, data: products });
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

export default {
  createProduct,
  getProducts,
  getProduct,
};
