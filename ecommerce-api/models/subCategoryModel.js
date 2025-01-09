import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: [true, "SubCategory must be unique"],
      minlength: [2, "Too short subCategory name"],
      maxlength: [32, "Too long subcategory name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },

    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "SubCategory must be belong to main category"],
    },
  },
  { timestamps: true }
);

const SubCategoryModel = mongoose.model("SubCategory", subCategorySchema);
export default SubCategoryModel;
