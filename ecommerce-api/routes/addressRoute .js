import express from "express";

import addressService from "../services/addressService .js";
import authMiddleware from "../middleware/authMiddleware.js";

// Destructure address service methods
const { addAddress, removeAddress, getMyAddresses } = addressService;

// Create a new router instance
const router = express.Router();

/**
 * Apply authentication and authorization middleware
 * - Ensures the user is authenticated and has one of the specified roles: "admin" or "user"
 */
router.use(authMiddleware.protect, authMiddleware.allowedTo("admin", "user"));

/**
 * Route: /api/v1/addresses/
 * - GET: Fetch the authenticated user's addresses
 * - POST: Add a new address for the authenticated user
 */
router
  .route("/")
  .get(getMyAddresses) // Fetch all addresses
  .post(addAddress); // Add a new address

/**
 * Route: /api/v1/addresses/:addressId
 * - DELETE: Remove a specific address by ID
 */
router.route("/:addressId").delete(removeAddress); // Remove an address by its ID

export default router;
