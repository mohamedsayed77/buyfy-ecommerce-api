import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Product name is required"],
      unique: [true, "Product name must be unique"],
      minlength: [3, "Product name must be at least 3 characters long"],
      maxlength: [100, "Product name can be a maximum of 100 characters long"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      minlength: [
        10,
        "Product description must be at least 10 characters long",
      ],
      maxlength: [
        500,
        "Product description can be a maximum of 500 characters long",
      ],
    },

    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
      min: [0, "Product quantity must be a positive number"],
    },

    sold: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      trim: true,
      max: [9999999, "too long product price"],
    },
    priceAfterDiscount: {
      type: Number,
      default: 0,
    },
    colors: {
      type: [String],
    },
    imageCover: {
      type: String,
      required: [true, "image cover is required"],
    },
    images: {
      type: [String],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must belong to a category"],
    },

    subCategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],

    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [0, "Rating average must be a positive number"],
      max: [5, "Rating average must be between 0 and 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name -_id",
  });
  next();
});

const ProductModel = mongoose.model("Product", productSchema);
export default ProductModel;
