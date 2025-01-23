/**
 * Custom API Error class extending the built-in Error class.
 * This class is used to define and handle operational errors in a standardized way.
 */
class ApiError extends Error {
  /**
   * Constructs an instance of the ApiError class.
   * @param {string} message - The error message.
   * @param {number} statusCode - The HTTP status code for the error.
   */
  constructor(message, statusCode) {
    super(message); // Call the parent Error class constructor with the message
    this.statusCode = statusCode; // Set the HTTP status code
    // Define error status based on the status code: "failed" for 4xx, "error" for 5xx
    this.status = `${statusCode}`.startsWith("4") ? "failed" : "error";
    this.isOperational = true; // Mark as operational to distinguish from programming errors
    Error.captureStackTrace(this, this.constructor); // Capture the stack trace
  }
}

export default ApiError;
