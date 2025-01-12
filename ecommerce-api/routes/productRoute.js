import express from "express";
import productService from "../services/productService.js";
import productValidator from "../utils/validators/productValidator.js";

const { createProduct, getProducts, getProduct, updateProduct, deleteProduct } =
  productService;
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = productValidator;

const router = express.Router();

router.route("/").get(getProducts).post(createProductValidator, createProduct);

router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(updateProductValidator, updateProduct)
  .delete(deleteProductValidator, deleteProduct);

export default router;
