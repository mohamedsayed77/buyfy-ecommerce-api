import jwt from "jsonwebtoken";
import AsyncHandler from "express-async-handler";
import ApiError from "../utils/ApiError.js";
import userModel from "../models/userModel.js";

/**
 * Middleware to ensure that the user is authenticated
 */
const protect = AsyncHandler(async (req, res, next) => {
  let token;

  // 1) Check if the token exists and extract it
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new ApiError(
        "You are not logged in. Please log in to access this route.",
        401
      )
    );
  }

  // 2) Verify the token (check for validity and expiration)
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (err) {
    return next(
      new ApiError("Invalid or expired token. Please log in again.", 401)
    );
  }

  // 3) Check if the user associated with the token still exists
  const currentUser = await userModel.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError("The user associated with this token no longer exists.", 401)
    );
  }

  // 4) Check if the user's account is active
  if (!currentUser.active) {
    return next(
      new ApiError(
        "Your account has been deactivated. Please contact support or log in again to reactivate.",
        403
      )
    );
  }

  // 5) Check if the user has changed their password after the token was issued
  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );

    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          "Your password has been changed. Please log in again.",
          401
        )
      );
    }
  }

  // Grant access to the protected route
  req.user = currentUser;
  next();
});

/**
 * Middleware to ensure the user has specific roles
 * @param {...string} roles - Array of allowed roles (e.g., ['admin', 'manager'])
 */
const allowedTo =
  (...roles) =>
  (req, res, next) => {
    // Check if the user's role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not authorized to access this route.", 403)
      );
    }
    next();
  };

export default { protect, allowedTo };
