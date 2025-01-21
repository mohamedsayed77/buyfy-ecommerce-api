import AsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import userModel from "../models/userModel.js";
import ApiError from "../utils/ApiError.js";

import jwt from "../utils/generateJwt.js";

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
    setTimeout(async () => {
      user.active = true;
      await user.save(); // Save changes to the database
    }, 60000);

    return next(
      new ApiError(
        "Your account is currently deactivated. It will be reactivated in 1 minute.",
        403
      )
    );
  }

  const token = jwt.createToken(user._id);
  res.status(200).json({ data: user, token });
});

export default {
  signup,
  login,
};
