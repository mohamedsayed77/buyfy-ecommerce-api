import express from "express";

import authService from "../services/authService.js";
import authValidator from "../utils/validators/authValidator.js";

// Destructure service methods
const { signup, login, forgetPassword, resetPassword } = authService;

// Destructure validation middlewares
const {
  signupValidator,
  loginValidator,
  forgetPaswordValidator,
  resetPasswordValidator,
} = authValidator;

// Initialize the router
const router = express.Router();

/**
 * Route: /api/v1/auth/signup
 * - POST: Register a new user
 * - Validation: `signupValidator` ensures the request body contains valid fields.
 * - Handler: `signup` handles user registration.
 */
router.post("/signup", signupValidator, signup);

/**
 * Route: /api/v1/auth/login
 * - POST: Login an existing user
 * - Validation: `loginValidator` ensures the request body contains valid credentials.
 * - Handler: `login` handles user authentication and token generation.
 */
router.post("/login", loginValidator, login);

/**
 * Route: /api/v1/auth/forgetPassword
 * - POST: Request a password reset
 * - Validation: `forgetPaswordValidator` ensures the email field is valid.
 * - Handler: `forgetPassword` generates and sends a reset code to the user via email.
 */
router.post("/forgetPassword", forgetPaswordValidator, forgetPassword);

/**
 * Route: /api/v1/auth/resetPassword
 * - POST: Reset the user's password
 * - Validation: `resetPasswordValidator` ensures the request body contains the reset code, email, and new password.
 * - Handler: `resetPassword` updates the user's password and invalidates the reset code.
 */
router.post("/resetPassword", resetPasswordValidator, resetPassword);

export default router;
