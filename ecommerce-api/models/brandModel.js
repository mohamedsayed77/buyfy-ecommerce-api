import mongoose from "mongoose";

/**
 * Brand Schema Definition
 * - Defines the structure and validation rules for the Brand model.
 */
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required."],
      unique: [true, "Brand name must be unique."],
      minlength: [2, "Brand name must be at least 2 characters long."],
      maxlength: [32, "Brand name must be at most 32 characters long."],
    },
    slug: {
      type: String,
      lowercase: true, // Ensure the slug is stored in lowercase
      unique: true,
    },
    image: String, // Path to the brand image
  },
  { timestamps: true } // Automatically add `createdAt` and `updatedAt` timestamps
);

/**
 * Middleware: Post 'init' Hook
 * - Modifies the `image` field to include the full URL after a document is retrieved from the database.
 */
brandSchema.post("init", (doc) => {
  if (doc.image) {
    doc.image = `${process.env.BASE_URL}:${process.env.PORT}/brands/${doc.image}`;
  }
});

/**
 * Middleware: Post 'save' Hook
 * - Modifies the `image` field to include the full URL after a document is saved to the database.
 */
brandSchema.post("save", (doc) => {
  if (doc.image) {
    doc.image = `${process.env.BASE_URL}:${process.env.PORT}/brands/${doc.image}`;
  }
});

/**
 * Brand Model
 * - Represents the Brand entity in the database.
 */
const brandModel = mongoose.model("Brand", brandSchema);

export default brandModel;
