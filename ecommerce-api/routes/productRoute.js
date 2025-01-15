import express from "express";

import productService from "../services/productService.js";
import productValidator from "../utils/validators/productValidator.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";
import resizeImage from "../middleware/imageProcessingMiddleware.js";

const { uploadMixImages } = uploadMiddleware;
const { resizeProductImages } = resizeImage;
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct } =
  productService;
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = productValidator;

// Define middleware to upload and handle product images
const uploadProductsImages = uploadMixImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

// Create a new router instance
const router = express.Router();

// Define routes for products
router
  .route("/")
  .get(getProducts)
  // Upload images, resize them, validate request, and create a product
  .post(
    uploadProductsImages,
    resizeProductImages,
    createProductValidator,
    createProduct
  );

// Define routes for a specific product by ID
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  // Upload images, resize them, validate request, and update a product by ID
  .put(
    uploadProductsImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(deleteProductValidator, deleteProduct);

export default router;
