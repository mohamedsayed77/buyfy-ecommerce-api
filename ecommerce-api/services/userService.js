import AsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "../utils/generateJwt.js";

import userModel from "../models/userModel.js";
import ApiError from "../utils/ApiError.js";
import ApiFeatures from "../utils/apiFeatures.js";

// @description    create a new user
// @route          Post  /api/v1/users
//  @access        Private
const createUser = AsyncHandler(async (req, res) => {
  const user = await userModel.create(req.body);
  res.status(201).json({ data: user });
});

// @discussion   Get list of users
// @route        Get /api/v1/users
// @access       public
const getUsers = AsyncHandler(async (req, res) => {
  // build the query
  const documentsCount = await userModel.countDocuments();
  const apiFeatures = new ApiFeatures(userModel.find(), req.query)
    .paginate(documentsCount)
    .search()
    .sort()
    .filter()
    .limitFields();

  const { query, paginationResult } = apiFeatures;

  // execute the query
  const users = await query;

  res
    .status(200)
    .json({ results: users.length, paginationResult, data: users });
});

// @discussion   Get specific user by id
// @route        Get /api/v1/users/:id
// @access       public
const getUser = AsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await userModel.findById(id);

  if (!user) {
    return next(new ApiError(`No user for this id ${id}`, 404));
  }

  res.status(200).json({ data: user });
});

// @description    update specific user
// @route          Post  /api/v1/users/:id
// @access        private
const updateUser = AsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await userModel.findOneAndUpdate(
    { _id: id },
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      new: true,
    }
  );

  if (!user) {
    return next(new ApiError(`No user for this id ${id}`, 404));
  }

  res.status(200).json({ data: user });
});

// @description    update specific user
// @route          Post  /api/v1/users/:id
// @access        private
const changeUserPassword = AsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await userModel.findOneAndUpdate(
    { _id: id },
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!user) {
    return next(new ApiError(`No user for this id ${id}`, 404));
  }

  res.status(200).json({ data: user });
});

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  changeUserPassword,
};
