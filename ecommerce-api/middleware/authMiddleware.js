import jwt from "jsonwebtoken";
import AsyncHandler from "express-async-handler";

import ApiError from "../utils/ApiError.js";
import userModel from "../models/userModel.js";

// @description    ensure that the user is authenticated

const protect = AsyncHandler(async (req, res, next) => {
  // 1) check if token exist , if exisst get it

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError(
        "you are not logedin, please login to get access this route",
        401
      )
    );
  }

  // 2) verify token (no change happend , expired token)

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // 3) check if user exists
  const currentUser = await userModel.findById(decoded.userId);

  if (!currentUser) {
    return next(
      new ApiError("The user that belong to this token does not exist.", 401)
    );
  }

  if (!currentUser.active) {
    return next(
      new ApiError(
        "Your account is deactivated, please log again to activate.",
        401
      )
    );
  }
  // 4) check if user change his password after token created
  if (currentUser.passwordChangedAt) {
    const passChangedTimeStamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );

    if (passChangedTimeStamp > decoded.iat) {
      return next(
        new ApiError("Your password has changed, please login again.", 401)
      );
    }
  }
  req.user = currentUser;
  next();
});

// @description    ensure that the user has specific roles
const allowedTo =
  (...roles) =>
  (req, res, next) => {
    // 1) access roles
    // 2) access registered user (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not authorized to access this route", 403)
      );
    }
    next();
  };

export default { protect, allowedTo };
