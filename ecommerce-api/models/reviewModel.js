import mongoose from "mongoose";
import Product from "./productModel.js";

/**
 * Review Schema Definition
 * - Defines the structure and validation rules for the Review model.
 */
const reviewSchema = new mongoose.Schema(
  {
    title: String, // Optional title for the review
    ratings: {
      type: Number,
      min: [1, "Minimum rating value is 1.0"],
      max: [5, "Maximum rating value is 5.0"],
      required: [true, "Rating value is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to a product"],
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

/**
 * Static Method: calcAverageRatingsAndQuantity
 * - Calculates the average rating and total number of reviews for a product.
 * - Updates the `ratingsAverage` and `ratingsQuantity` fields of the product.
 *
 * @param {ObjectId} productId - The ID of the product.
 */
reviewSchema.statics.calcAverageRatingsAndQuantity = async function (
  productId
) {
  const result = await this.aggregate([
    {
      $match: { product: productId }, // Filter reviews for the specific product
    },
    {
      $group: {
        _id: "$product", // Group reviews by product ID
        avgRatings: { $avg: "$ratings" }, // Calculate the average rating
        ratingsQuantity: { $sum: 1 }, // Count the number of reviews
      },
    },
  ]);

  // Update the product with the calculated values or reset if no reviews exist
  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: result[0].avgRatings,
      ratingsQuantity: result[0].ratingsQuantity,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

/**
 * Middleware: Post 'save' Hook
 * - Updates product ratings after saving a review.
 */
reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

/**
 * Middleware: Post 'remove' Hook
 * - Updates product ratings after removing a review.
 */
reviewSchema.post("remove", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

/**
 * Middleware: Pre 'find' Hook
 * - Automatically populates the `user` field with the user's name when querying reviews.
 */
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name", // Include only the user's name
  });
  next();
});

/**
 * Review Model
 * - Represents the Review entity in the database.
 */
const reviewModel = mongoose.model("Review", reviewSchema);

export default reviewModel;
