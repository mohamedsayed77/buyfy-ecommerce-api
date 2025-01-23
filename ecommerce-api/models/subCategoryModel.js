import mongoose from "mongoose";

/**
 * Subcategory Schema Definition
 * - Defines the structure and validation rules for the Subcategory model.
 */
const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true, // Removes whitespace from both ends of the string
      required: [true, "Subcategory name is required."],
      unique: [true, "Subcategory name must be unique."],
      minlength: [2, "Subcategory name must be at least 2 characters long."],
      maxlength: [32, "Subcategory name must be at most 32 characters long."],
    },
    slug: {
      type: String,
      lowercase: true, // Ensures the slug is stored in lowercase
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category", // References the Category model
      required: [true, "Subcategory must belong to a main category."],
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

/**
 * Middleware: Pre 'find' Hook
 * - Automatically populates the `category` field with the category name when querying subcategories.
 */
subCategorySchema.pre(/^find/, function (next) {
  this.populate({
    path: "category", // Field to populate
    select: "name -_id", // Include only the name of the category, exclude the ID
  });
  next();
});

/**
 * Subcategory Model
 * - Represents the Subcategory entity in the database.
 */
const SubCategoryModel = mongoose.model("SubCategory", subCategorySchema);

export default SubCategoryModel;
