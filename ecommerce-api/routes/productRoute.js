import express from "express";

import productService from "../services/productService.js";
import productValidator from "../utils/validators/productValidator.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";
import resizeImage from "../middleware/imageProcessingMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";
import reviewRoute from "./reviewRoute.js";

// Destructure necessary utilities and services
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
  { name: "imageCover", maxCount: 1 }, // Cover image (1 max)
  { name: "images", maxCount: 5 }, // Additional images (up to 5)
]);

// Create a new router instance
const router = express.Router();

/**
 * Nested Route: Reviews for a specific product
 * Example: `/api/v1/products/:productId/reviews`
 * - Delegates to `reviewRoute`.
 */
router.use("/:productId/reviews", reviewRoute);

/**
 * Route: /api/v1/products
 * - GET: Fetch a list of all products (public).
 * - POST: Create a new product (restricted to Admin/Manager).
 */
router
  .route("/")
  .get(getProducts) // Public: Retrieve all products with filters, pagination, and sorting
  .post(
    authMiddleware.protect,
    authMiddleware.allowedTo("admin", "manager"),
    uploadProductsImages, // Handle image uploads for products
    resizeProductImages, // Resize uploaded images
    createProductValidator, // Validate request body
    createProduct // Create a new product
  );

/**
 * Route: /api/v1/products/:id
 * - GET: Fetch a specific product by ID (public).
 * - PUT: Update an existing product (restricted to Admin/Manager).
 * - DELETE: Delete a product by ID (restricted to Admin/Manager).
 */
router
  .route("/:id")
  .get(getProductValidator, getProduct) // Public: Fetch a single product by ID
  .put(
    authMiddleware.protect,
    authMiddleware.allowedTo("admin", "manager"),
    uploadProductsImages, // Handle image uploads for product updates
    resizeProductImages, // Resize uploaded images
    updateProductValidator, // Validate request body
    updateProduct // Update a product
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.allowedTo("admin", "manager"),
    deleteProductValidator, // Validate the product ID
    deleteProduct // Delete a product
  );

export default router;
