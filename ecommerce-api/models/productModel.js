import mongoose from "mongoose";

// Define the product schema
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Product name is required."],
      unique: [true, "Product name must be unique."],
      minlength: [3, "Product name must be at least 3 characters long."],
      maxlength: [100, "Product name can be at most 100 characters long."],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required."],
      minlength: [
        20,
        "Product description must be at least 20 characters long.",
      ],
      maxlength: [
        500,
        "Product description can be at most 500 characters long.",
      ],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required."],
      min: [0, "Product quantity must be a positive number."],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price is required."],
      trim: true,
      max: [999999, "Product price must be at most 999999."],
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
      required: [true, "Image cover is required."],
    },
    images: {
      type: [String],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must belong to a category."],
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
      min: [0, "Rating average must be a positive number."],
      max: [5, "Rating average must be between 0 and 5."],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Mongoose middleware that populates the category field with its name
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name -_id",
  });
  next();
});

/**
 * Function to set the full URL for image fields in the document.
 * @param {Object} doc - The document object.
 */
const setImageUrl = (doc) => {
  if (doc.imageCover) {
    const url = `${process.env.BASE_URL}:${process.env.PORT}/products/${doc.imageCover}`;
    doc.imageCover = url; // Set the full URL for the image cover
  }
  if (doc.images) {
    const imageList = [];
    doc.images.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}:${process.env.PORT}/products/${image}`;
      imageList.push(imageUrl); // Add the full URL for each image to the list
    });
    doc.images = imageList; // Update the images field with the list of full URLs
  }
};

/**
 * Mongoose post hook that modifies the 'imageCover' and 'images' fields
 * after a document is initialized (retrieved from the database).
 */
productSchema.post("init", (doc) => {
  setImageUrl(doc);
});

/**
 * Mongoose post hook that modifies the 'imageCover' and 'images' fields
 * after a document is saved to the database.
 */
productSchema.post("save", (doc) => {
  setImageUrl(doc);
});

// Create the product model from the schema
const ProductModel = mongoose.model("Product", productSchema);
export default ProductModel;
