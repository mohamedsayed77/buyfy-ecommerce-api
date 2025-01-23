import { validationResult } from "express-validator";

/**
 * Middleware to handle validation results from `express-validator`.
 *
 * - If validation errors exist:
 *   - Responds with a `400 Bad Request` status code.
 *   - Returns an array of error details, including the field and the corresponding error message.
 * - If no errors are found:
 *   - Passes control to the next middleware or route handler.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - Callback to pass control to the next middleware.
 */
const validatorMiddleware = (req, res, next) => {
  const errors = validationResult(req); // Retrieve validation results from the request
  if (!errors.isEmpty()) {
    // If validation errors exist, respond with a 400 status and detailed error messages
    return res.status(400).json({
      status: "fail", // Standardized response status
      message: "Validation failed. Please check the input fields.",
      errors: errors.array().map((err) => ({
        field: err.param, // The field with the validation error
        message: err.msg, // The validation error message
      })),
    });
  }
  // No validation errors; proceed to the next middleware or route handler
  next();
};

export default validatorMiddleware;
