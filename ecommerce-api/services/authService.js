import AsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";

import userModel from "../models/userModel.js";
import ApiError from "../utils/ApiError.js";
import hashCode from "../utils/hash.js";
import sendEmail from "../utils/sendEmail.js";
import jwt from "../utils/generateJwt.js";
import mailContent from "../utils/mailContent.js";

/**
 * @description    Register a new user
 * @route          POST /api/v1/auth/signup
 * @access         Public
 */
const signup = AsyncHandler(async (req, res) => {
  const user = await userModel.create({
    name: req.body.name,
    slug: req.body.slug,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
  });

  const token = jwt.createToken(user._id);
  res.status(201).json({
    status: "success",
    message: "User registered successfully.",
    data: { user, token },
  });
});

/**
 * @description    Login user
 * @route          POST /api/v1/auth/login
 * @access         Public
 */
const login = AsyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(
      new ApiError(
        "Invalid email or password. Please check your credentials and try again.",
        401
      )
    );
  }

  if (!user.active) {
    if (!user.reactivationInProgress) {
      // Deactivated account logic
      user.reactivationInProgress = true;
      await user.save();

      setTimeout(async () => {
        user.active = true;
        user.reactivationInProgress = false;
        await user.save();
        console.log("User account reactivated.");
      }, 60000);

      return next(
        new ApiError(
          "Your account is deactivated. It will be reactivated in 1 minute.",
          403
        )
      );
    }
    return next(
      new ApiError(
        "Your account is currently being reactivated. Please wait a moment.",
        403
      )
    );
  }

  const token = jwt.createToken(user._id);
  res.status(200).json({
    status: "success",
    message: "Login successful.",
    data: { user, token },
  });
});

/**
 * @description    Request password reset
 * @route          POST /api/v1/auth/forgotPassword
 * @access         Public
 */
const forgetPassword = AsyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });

  if (!user) {
    return next(new ApiError("No user found with this email.", 404));
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = hashCode(resetCode);

  user.passwordResetCode = hashedResetCode;
  user.passwordResetExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  user.passwordResetVerified = false;
  await user.save();

  const html = mailContent(user.name, resetCode);

  try {
    await sendEmail({
      email: user.email,
      subject: "Reset Password",
      html: html,
    });
    res.status(200).json({
      status: "success",
      message: "Reset password code sent to your email.",
    });
  } catch (error) {
    user.passwordResetCode = undefined;
    user.passwordResetExpiresAt = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    return next(
      new ApiError("Failed to send email. Please try again later.", 500)
    );
  }
});

/**
 * @description    Reset password using the reset code
 * @route          POST /api/v1/auth/resetPassword
 * @access         Public
 */
const resetPassword = AsyncHandler(async (req, res, next) => {
  const { email, resetCode, newPassword } = req.body;

  const hashedResetCode = hashCode(resetCode);
  const user = await userModel.findOne({
    email,
    passwordResetCode: hashedResetCode,
    passwordResetExpiresAt: { $gt: Date.now() }, // Ensure reset code is still valid
  });

  if (!user) {
    return next(new ApiError("Invalid or expired reset code.", 400));
  }

  user.password = newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpiresAt = undefined;
  await user.save();

  const token = jwt.createToken(user._id);
  res.status(200).json({
    status: "success",
    message: "Password reset successfully.",
    data: { token },
  });
});

export default {
  signup,
  login,
  forgetPassword,
  resetPassword,
};
