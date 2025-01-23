import AsyncHandler from "express-async-handler";
import userModel from "../models/userModel.js";

/**
 * @description Add a new address to the user's address list.
 * @route       POST /api/v1/address
 * @access      Protected/User
 */
const addAddress = AsyncHandler(async (req, res) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { addresses: req.body } }, // Add the new address if it doesn't already exist
    { new: true } // Return the updated document
  );

  res.status(201).json({
    status: "success",
    message: "Address added successfully.",
    data: user.addresses,
  });
});

/**
 * @description Remove an address from the user's address list.
 * @route       DELETE /api/v1/address/:addressId
 * @access      Protected/User
 */
const removeAddress = AsyncHandler(async (req, res) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    { $pull: { addresses: { _id: req.params.addressId } } }, // Remove the address by ID
    { new: true } // Return the updated document
  );

  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "User not found or address does not exist.",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Address removed successfully.",
    data: user.addresses,
  });
});

/**
 * @description Get the list of the logged-in user's addresses.
 * @route       GET /api/v1/address
 * @access      Protected/User
 */
const getMyAddresses = AsyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "User not found.",
    });
  }

  res.status(200).json({
    status: "success",
    results: user.addresses.length,
    data: user.addresses,
  });
});

export default {
  addAddress,
  removeAddress,
  getMyAddresses,
};
