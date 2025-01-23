import AsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "../utils/generateJwt.js";
import userModel from "../models/userModel.js";

/**
 * @description    Deactivate the authenticated user's account
 * @route          DELETE /api/v1/me/deactivateMe
 * @access         Protected (User)
 */
const deactivateMe = AsyncHandler(async (req, res, next) => {
  if (req.user.active) {
    await userModel.findByIdAndUpdate(req.user._id, {
      active: false,
    });

    res.status(204).json({
      status: "success",
      message: "Account deactivated successfully.",
    });
  } else {
    res.status(400).json({
      status: "fail",
      message: "Account is already deactivated.",
    });
  }
});

/**
 * @description    Get details of the authenticated user
 * @route          GET /api/v1/me/getMe
 * @access         Protected (User)
 */
const getMe = AsyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user._id);

  res.status(200).json({
    status: "success",
    data: user,
  });
});

/**
 * @description    Change the authenticated user's password
 * @route          PUT /api/v1/me/changeMyPassword
 * @access         Protected (User)
 */
const changeMyPassword = AsyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "User not found.",
    });
  }

  const token = jwt.createToken(user._id);

  res.status(200).json({
    status: "success",
    message: "Password updated successfully.",
    data: user,
    token,
  });
});

/**
 * @description    Update the authenticated user's profile
 * @route          PUT /api/v1/me/updateMyData
 * @access         Protected (User)
 */
const updateMe = AsyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      profileImg: req.body.profileImg,
    },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "User not found.",
    });
  }

  const token = jwt.createToken(user._id);

  res.status(200).json({
    status: "success",
    message: "Profile updated successfully.",
    data: user,
    token,
  });
});

export default {
  deactivateMe,
  getMe,
  changeMyPassword,
  updateMe,
};
