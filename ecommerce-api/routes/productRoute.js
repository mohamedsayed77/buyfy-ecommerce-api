import express from "express";
import productService from "../services/productService.js";

const { createProduct, getProducts, getProduct, updateProduct, deleteProduct } =
  productService;

const router = express.Router();

router.route("/").post(createProduct).get(getProducts);

router.route("/:id").get(getProduct).put(updateProduct).delete(deleteProduct);

export default router;
