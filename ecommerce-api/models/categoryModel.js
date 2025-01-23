import mongoose from "mongoose";

/**
 * Category Schema Definition
 * - Defines the structure and validation rules for the Category model.
 */
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required."],
      unique: [true, "Category name must be unique."],
      minlength: [2, "Category name must be at least 2 characters long."],
      maxlength: [32, "Category name must be at most 32 characters long."],
    },
    slug: {
      type: String,
      lowercase: true, // Ensure the slug is stored in lowercase
      unique: true,
    },
    image: String, // Stores the filename of the category image
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

/**
 * Middleware: Post 'init' Hook
 * - Modifies the `image` field to include the full URL after a document is retrieved from the database.
 */
categorySchema.post("init", (doc) => {
  if (doc.image) {
    doc.image = `${process.env.BASE_URL}:${process.env.PORT}/categories/${doc.image}`;
  }
});

/**
 * Middleware: Post 'save' Hook
 * - Modifies the `image` field to include the full URL after a document is saved to the database.
 */
categorySchema.post("save", (doc) => {
  if (doc.image) {
    doc.image = `${process.env.BASE_URL}:${process.env.PORT}/categories/${doc.image}`;
  }
});

/**
 * Category Model
 * - Represents the Category entity in the database.
 */
const categoryModel = mongoose.model("Category", categorySchema);

export default categoryModel;
