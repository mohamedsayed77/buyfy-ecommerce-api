import express from "express";
import brandService from "../services/brandService.js";
import brandValidator from "../utils/validators/brandValidator.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";
import resizeImage from "../middleware/imageProcessingMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

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

// Define routes for brands
router
  .route("/")
  .get(getBrands)
  // Upload image, resize it, validate request, and create a brand
  .post(
    authMiddleware.protect,
    authMiddleware.allowedTo("admin", "manager"),
    uploadSingleImage("image"),
    resizeBrandImage(),
    createBrandValidator,
    createBrand
  );

// Define routes for a specific brand by ID
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  // Upload image, resize it, validate request, and update a brand by ID
  .put(
    authMiddleware.protect,
    authMiddleware.allowedTo("admin", "manager"),
    uploadSingleImage("image"),
    resizeBrandImage(),
    updateBrandValidator,
    updateBrand
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.allowedTo("admin", "manager"),
    deleteBrandValidator,
    deleteBrand
  );

export default router;
