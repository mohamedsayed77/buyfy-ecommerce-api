// @description:   this class is responsible about operation errors (errors that i can predict)
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith(4) ? "failed" : "error";
    this.isOperational = true;
  }
}

export default ApiError;
