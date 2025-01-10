import mongoose from "mongoose";

// create Schema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand required"],
      unique: [true, "Brand must be unique"],
      minlength: [2, "To short brand name"],
      maxlength: [32, "To long brand name"],
    },

    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },
    image: String,
  },
  { timestamps: true }
);

const brandModel = mongoose.model("Brand", brandSchema);
export default brandModel;
