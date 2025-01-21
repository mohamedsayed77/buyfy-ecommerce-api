import AsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";

import userModel from "../models/userModel.js";
import ApiError from "../utils/ApiError.js";
import hashCode from "../utils/hash.js";
import sendEmail from "../utils/sendEmail.js";
import jwt from "../utils/generateJwt.js";
import mailContent from "../utils/mailContent.js";

// @description    signup
// @route          Post  /api/v1/auth/signup
//  @access        Public

const signup = AsyncHandler(async (req, res, next) => {
  const user = await userModel.create({
    name: req.body.name,
    slug: req.body.slug,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
  });

  const token = jwt.createToken(user._id);
  res.status(201).json({ data: user, token });
});

// @description    login
// @route          Post  /api/v1/auth/login
//  @access        Public

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
      // Set the reactivationInProgress flag
      user.reactivationInProgress = true;
      await user.save();

      setTimeout(async () => {
        user.active = true;
        user.reactivationInProgress = false;
        await user.save(); // Save changes to the database
        console.log("User account reactivated");
      }, 60000);

      return next(
        new ApiError(
          "Your account is currently deactivated. It will be reactivated in 1 minute.",
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
  res.status(200).json({ data: user, token });
});

// @description    forget password
// @route          Post  /api/v1/auth/forgotPassword
//  @access        Public
const forgetPassword = AsyncHandler(async (req, res, next) => {
  // 1) get user by email
  const user = await userModel.findOne({ email: req.body.email });

  if (!user) {
    return next(new ApiError("No user found with this email", 404));
  }

  // 2) if user exists, generate random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = hashCode(resetCode);
  console.log(hashedResetCode);

  user.passwordResetCode = hashedResetCode;
  user.passwordResetExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  user.passwordResetVerified = false;
  await user.save();

  // 3) send the reset code via email
  const html = mailContent(user.name, resetCode);

  try {
    await sendEmail({
      email: user.email,
      subject: "Reset Password",
      html: html,
    });
    res.status(200).json({
      status: "success",
      message: "Reset password code sent successfully",
    });
  } catch (error) {
    user.passwordResetCode = undefined;
    user.passwordResetExpiresAt = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    return next(new ApiError("Failed to send email", 500));
  }

  try {
    await sendEmail({
      email: user.email,
      subject: "Reset Password",
      html: html,
    });
    res.status(200).json({
      status: "success",
      message: "Reset password code sent successfully",
    });
  } catch (error) {
    user.passwordResetCode = undefined;
    user.passwordResetExpiresAt = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    return next(new ApiError("Failed to send email", 500));
  }
});

export default {
  signup,
  login,
  forgetPassword,
};
