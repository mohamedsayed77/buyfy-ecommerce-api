import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      min: [1, "Minimum rating value is 1.0"],
      max: [5, "Maximum rating value is 5.0"],
      required: [true, "The rating value is required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user."],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to a product."],
    },
  },
  { timestamps: true }
);
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name -_id",
  });

  next();
});

const reviewModel = mongoose.model("Review", reviewSchema);
export default reviewModel;
