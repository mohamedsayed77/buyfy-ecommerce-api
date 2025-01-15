import mongoose from "mongoose";

// Define the subcategory schema
const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: [true, "Subcategory name must be unique."],
      minlength: [2, "Subcategory name must be at least 2 characters long."],
      maxlength: [32, "Subcategory name must be at most 32 characters long."],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Subcategory must belong to a main category."],
    },
  },
  { timestamps: true }
);

// Mongoose middleware that populates the category field with its name
subCategorySchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name -_id",
  });
  next();
});

// Create the subcategory model from the schema
const SubCategoryModel = mongoose.model("SubCategory", subCategorySchema);
export default SubCategoryModel;
