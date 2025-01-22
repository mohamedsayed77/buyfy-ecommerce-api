import express from "express";

import wishlistService from "../services/wishlistService .js";
import authMiddleware from "../middleware/authMiddleware.js";

const { addProductToWishList, removeProductToWishList, getMyWishlist } =
  wishlistService;

const router = express.Router();

router.use(authMiddleware.protect, authMiddleware.allowedTo("admin", "user"));

router.route("/").get(getMyWishlist).post(addProductToWishList);

router.route("/:productId").delete(removeProductToWishList);

export default router;
