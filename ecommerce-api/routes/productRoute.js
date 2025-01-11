import express from "express";
import productService from "../services/productService.js";

const { createProduct, getProducts, getProduct } = productService;

const router = express.Router();

router.route("/").post(createProduct).get(getProducts);

router.route("/:id").get(getProduct);

export default router;
