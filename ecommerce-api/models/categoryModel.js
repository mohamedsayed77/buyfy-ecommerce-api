import mongoose from "mongoose";

// create Schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category required"],
      unique: [true, "Category must be unique"],
      minlength: [3, "To short category name"],
      maxlength: [32, "To long category name"],
    },
    // A and B => shoping.com/a-and-b
    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },
    image: String,
  },
  { timestamps: true }
);

const categoryModel = mongoose.model("Category", categorySchema);
export default categoryModel;
