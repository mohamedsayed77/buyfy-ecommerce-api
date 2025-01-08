import mongoose from "mongoose";

// create subCategory Schema

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "subCategory required"],
      unique: [true, "subCategory must be unique"],
      minlength: [2, "To short subcategory name"],
      maxlength: [32, "To long subcategory name"],
    },
    // A and B => shoping.com/a-and-b
    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Subcategory must be belongs to main category"],
    },
  },
  { timestamps: true }
);

const subCategoryModel = mongoose.model("SubCategory", subCategorySchema);
export default subCategoryModel;
