import AsyncHandler from "express-async-handler";
import userModel from "../models/userModel.js";

/**
 * @description    Add a product to the user's wishlist
 * @route          POST /api/v1/wishlist
 * @access         Protected (User)
 */
const addProductToWishList = AsyncHandler(async (req, res) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    // Add product to wishlist. Prevent duplicates with `$addToSet`.
    { $addToSet: { wishlist: req.body.productId } },
    { new: true }
  );

  res.status(201).json({
    status: "success",
    message: "Product added to your wishlist successfully.",
    data: user.wishlist,
  });
});

/**
 * @description    Remove a product from the user's wishlist
 * @route          DELETE /api/v1/wishlist/:productId
 * @access         Protected (User)
 */
const removeProductToWishList = AsyncHandler(async (req, res) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    // Remove product from wishlist using `$pull`
    { $pull: { wishlist: req.params.productId } },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Product removed from your wishlist successfully.",
    data: user.wishlist,
  });
});

/**
 * @description    Retrieve the user's wishlist
 * @route          GET /api/v1/wishlist
 * @access         Protected (User)
 */
const getMyWishlist = AsyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user._id).populate("wishlist");

  res.status(200).json({
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
