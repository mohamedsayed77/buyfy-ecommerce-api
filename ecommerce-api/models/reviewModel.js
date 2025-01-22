import mongoose from "mongoose";
import Product from "./productModel.js";

const reviewSchema = new mongoose.Schema(
  {
    title: String,
    ratings: {
      type: Number,
      min: [1, "Minimum rating value is 1.0"],
      max: [5, "Maximum rating value is 5.0"],
      required: [true, "Rating value is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

// Static method to calculate ratingsAverage and ratingsQuantity
reviewSchema.statics.calcAverageRatingsAndQuantity = async function (
  productId
) {
  const result = await this.aggregate([
    {
      $match: { product: productId }, // Find reviews for the product
    },
    {
      $group: {
        _id: "$product", // Group by product ID
        avgRatings: { $avg: "$ratings" }, // Calculate average rating
        ratingsQuantity: { $sum: 1 }, // Count reviews
      },
    },
  ]);

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

// Middleware to update ratings after saving a review
reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

// Middleware to update ratings after removing a review
reviewSchema.post("remove", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name",
  });
  next();
});

const reviewModel = mongoose.model("Review", reviewSchema);
export default reviewModel;
