import express from "express";

import wishlistService from "../services/wishlistService .js";
import authMiddleware from "../middleware/authMiddleware.js";

const { addProductToWishList, removeProductToWishList, getMyWishlist } =
  wishlistService;

const router = express.Router();

// Protect all wishlist routes and restrict access to "admin" and "user" roles
router.use(authMiddleware.protect, authMiddleware.allowedTo("admin", "user"));

/**
 * Route: /api/v1/wishlist
 * - GET: Retrieve the logged-in user's wishlist.
 * - POST: Add a product to the logged-in user's wishlist.
 */
router
  .route("/")
  .get(getMyWishlist) // Retrieve the wishlist
  .post(addProductToWishList); // Add a product to the wishlist

/**
 * Route: /api/v1/wishlist/:productId
 * - DELETE: Remove a product from the logged-in user's wishlist.
 */
router.route("/:productId").delete(removeProductToWishList); // Remove a product from the wishlist

export default router;
