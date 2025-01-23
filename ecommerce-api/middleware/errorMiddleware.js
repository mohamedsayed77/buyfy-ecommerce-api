/**
 * Sends detailed error information during development mode
 * @param {Object} err - Error object
 * @param {Object} res - Express response object
 */
const sendErrorForDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err, // Full error object
    message: err.message, // Error message for debugging
    stack: err.stack, // Stack trace for debugging
  });
};

/**
 * Sends simplified error information during production mode
 * @param {Object} err - Error object
 * @param {Object} res - Express response object
 */
const sendErrorForProd = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message || "Something went wrong!", // User-friendly message
  });
};

/**
 * Global error handling middleware for the application
 * @param {Object} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const globalError = (err, req, res, next) => {
  // Default error properties
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    // Provide detailed error output in development mode
    sendErrorForDev(err, res);
  } else {
    // Provide simplified error output in production mode
    sendErrorForProd(err, res);
  }
};

export default globalError;
