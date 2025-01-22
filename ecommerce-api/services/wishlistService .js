import AsyncHandler from "express-async-handler";

import userModel from "../models/userModel.js";
// import ApiError from "../utils/ApiError.js";
// import ApiFeatures from "../utils/apiFeatures.js";

// @description    add product to wish list
// @route          Post  /api/v1/wishlist
//  @access        protect/user
const addProductToWishList = AsyncHandler(async (req, res) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    // add product to wish list if it already exists it wont add it
    { $addToSet: { wishlist: req.body.productId } },
    { new: true }
  );
  res.status(201).json({
    status: "success",
    message: "product added successfully to your wish list.",
    data: user.wishlist,
  });
});

// @description    remove product to wish list
// @route          delete  /api/v1/wishlist
//  @access        protect/user
const removeProductToWishList = AsyncHandler(async (req, res) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    // pull => remove prooduct from wish list
    { $pull: { wishlist: req.params.productId } },
    { new: true }
  );

  res.status(201).json({
    status: "success",
    message: "product removed successfully from your wish list.",
    data: user.wishlist,
  });
});

// @description    remove product to wish list
// @route          Post  /api/v1/wishlist
//  @access        protect/user
const getMyWishlist = AsyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user._id).populate("wishlist");

  res.status(201).json({
    status: "success",
    results: user.wishlist.length,
    data: user.wishlist,
  });
});

export default {
  addProductToWishList,
  removeProductToWishList,
  getMyWishlist,
};
