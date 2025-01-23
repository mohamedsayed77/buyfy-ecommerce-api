import express from "express";
import brandService from "../services/brandService.js";
import brandValidator from "../utils/validators/brandValidator.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";
import resizeImage from "../middleware/imageProcessingMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

// Destructure necessary methods and middleware
const { uploadSingleImage } = uploadMiddleware;
const { resizeBrandImage } = resizeImage;
const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = brandValidator;
const { getBrands, createBrand, getBrand, updateBrand, deleteBrand } =
  brandService;

// Create a new router instance
const router = express.Router();

/**
 * Route: /api/v1/brands/
 * - GET: Retrieve a list of all brands.
 * - POST: Create a new brand (Admin or Manager only).
 *   - Uploads and resizes a brand image.
 *   - Validates the request body.
 */
router
  .route("/")
  .get(getBrands) // Fetch all brands
  .post(
    authMiddleware.protect, // Ensure the user is authenticated
    authMiddleware.allowedTo("admin", "manager"), // Restrict access to admin and manager roles
    uploadSingleImage("image"), // Upload a single brand image
    resizeBrandImage(), // Resize the uploaded image
    createBrandValidator, // Validate the request body
    createBrand // Handle brand creation
  );

/**
 * Route: /api/v1/brands/:id
 * - GET: Retrieve details of a specific brand by its ID.
 * - PUT: Update a specific brand by its ID (Admin or Manager only).
 *   - Uploads and resizes a brand image.
 *   - Validates the request body.
 * - DELETE: Remove a specific brand by its ID (Admin or Manager only).
 */
router
  .route("/:id")
  .get(getBrandValidator, getBrand) // Fetch a brand by ID
  .put(
    authMiddleware.protect, // Ensure the user is authenticated
    authMiddleware.allowedTo("admin", "manager"), // Restrict access to admin and manager roles
    uploadSingleImage("image"), // Upload a single brand image
    resizeBrandImage(), // Resize the uploaded image
    updateBrandValidator, // Validate the request body
    updateBrand // Handle brand update
  )
  .delete(
    authMiddleware.protect, // Ensure the user is authenticated
    authMiddleware.allowedTo("admin", "manager"), // Restrict access to admin and manager roles
    deleteBrandValidator, // Validate the brand ID
    deleteBrand // Handle brand deletion
  );

export default router;
