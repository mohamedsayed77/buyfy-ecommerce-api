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

const uploadProductsImages = uploadMixImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(
    uploadProductsImages,
    resizeProductImages,
    createProductValidator,
    createProduct
  );

router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    uploadProductsImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(deleteProductValidator, deleteProduct);

export default router;
