import AsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import ApiError from "../utils/ApiError.js";
import ApiFeatures from "../utils/apiFeatures.js";

/**
 * @description    Create a new user
 * @route          POST /api/v1/admin
 * @access         Admin only
 */
const createUser = AsyncHandler(async (req, res) => {
  const user = await userModel.create(req.body);
  res.status(201).json({
    status: "success",
    message: "User created successfully.",
    data: user,
  });
});

/**
 * @description    Get list of all users
 * @route          GET /api/v1/admin
 * @access         Admin only
 */
const getUsers = AsyncHandler(async (req, res) => {
  const documentsCount = await userModel.countDocuments();
  const apiFeatures = new ApiFeatures(userModel.find(), req.query)
    .paginate(documentsCount)
    .search()
    .sort()
    .filter()
    .limitFields();

  const { query, paginationResult } = apiFeatures;
  const users = await query;

  res.status(200).json({
    status: "success",
    results: users.length,
    paginationResult,
    data: users,
  });
});

/**
 * @description    Get a specific user by ID
 * @route          GET /api/v1/admin/:id
 * @access         Admin only
 */
const getUser = AsyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);

  if (!user) {
    return next(new ApiError(`User not found for ID ${req.params.id}`, 404));
  }

  res.status(200).json({
    status: "success",
    data: user,
  });
});

/**
 * @description    Update a user by ID
 * @route          PUT /api/v1/admin/:id
 * @access         Admin only
 */
const updateUser = AsyncHandler(async (req, res, next) => {
  const user = await userModel.findOneAndUpdate(
    { _id: req.params.id },
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    { new: true }
  );

  if (!user) {
    return next(new ApiError(`User not found for ID ${req.params.id}`, 404));
  }

  res.status(200).json({
    status: "success",
    message: "User updated successfully.",
    data: user,
  });
});

/**
 * @description    Change password for a specific user by ID
 * @route          PUT /api/v1/admin/:id/changepassword
 * @access         Admin only
 */
const changePassword = AsyncHandler(async (req, res, next) => {
  const user = await userModel.findOneAndUpdate(
    { _id: req.params.id },
    {
      password: await bcrypt.hash(req.body.newPassword, 12),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );

  if (!user) {
    return next(new ApiError(`User not found for ID ${req.params.id}`, 404));
  }

  res.status(200).json({
    status: "success",
    message: "Password changed successfully.",
    data: user,
  });
});

/**
 * @description    Delete a user by ID
 * @route          DELETE /api/v1/admin/:id
 * @access         Admin only
 */
const deleteUser = AsyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new ApiError(`User not found for ID ${req.params.id}`, 404));
  }

  res.status(204).json({
    status: "success",
    message: "User deleted successfully.",
  });
});

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  changePassword,
  deleteUser,
};
