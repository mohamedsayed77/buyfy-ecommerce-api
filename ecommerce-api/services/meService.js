import AsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "../utils/generateJwt.js";

import userModel from "../models/userModel.js";

// @description    deactivate My Account
// @route          Delete  /api/v1/me/deactivateMe
// @access          protected
const deactivateMe = AsyncHandler(async (req, res, next) => {
  if (req.user.active) {
    await userModel.findByIdAndUpdate(req.user._id, {
      active: false,
    });
    res.status(204).json({ status: "success" });
  }
});

const getMe = AsyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user._id);

  res.status(200).json({ data: user });
});

const changeMyPassword = AsyncHandler(async (req, res, next) => {
  const user = await userModel.findOneAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  const token = jwt.createToken(user._id);
  res.status(200).json({ data: user, token });

  next();
});
const updateMe = AsyncHandler(async (req, res, next) => {
  const user = await userModel.findOneAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      profileImg: req.body.profileImg,
    },
    {
      new: true,
    }
  );
  const token = jwt.createToken(user._id);
  res.status(200).json({ data: user, token });
});

export default {
  deactivateMe,
  getMe,
  changeMyPassword,
  updateMe,
};
