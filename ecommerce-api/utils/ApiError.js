/**
 * Custom API Error class extending the built-in Error class.
 * This class is used to define operational errors in a standardized way.
 */
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message); // Call the parent class constructor with the message parameter
    this.statusCode = statusCode; // Set the HTTP status code
    this.status = `${statusCode}`.startsWith(4) ? "failed" : "error"; // Determine the status based on the status code
    this.isOperational = true; // Mark the error as operational
  }
}

export default ApiError;
