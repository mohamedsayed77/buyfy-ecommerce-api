import express from "express";
import brandService from "../services/brandService.js";
import brandValidator from "../utils/validators/brandValidator.js";
import uploadMiddleware from "../middleware/uploadMiddleware.js";
import resizeImage from "../middleware/imageProcessingMiddleware.js";

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

const router = express.Router();

router
  .route("/")
  .get(getBrands)
  .post(
    uploadSingleImage("image"),
    resizeBrandImage(),
    createBrandValidator,
    createBrand
  );

router
  .route("/:id")
  .get(getBrandValidator, getBrand)

  .put(
    uploadSingleImage("image"),
    resizeBrandImage(),
    updateBrandValidator,
    updateBrand
  )
  .delete(deleteBrandValidator, deleteBrand);

export default router;
