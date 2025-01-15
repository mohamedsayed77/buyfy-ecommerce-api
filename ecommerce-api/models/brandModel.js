import mongoose from "mongoose";

// Define the brand schema
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
      lowercase: true,
      unique: true,
    },
    image: String,
  },
  { timestamps: true }
);

// Mongoose post hook that modifies the 'image' field after a document is initialized (retrieved from the database)
brandSchema.post("init", (doc) => {
  // Append the base URL and port to the image field, if it exists, to create a full URL
  if (doc.image) {
    const url = `${process.env.BASE_URL}:${process.env.PORT}/brands/${doc.image}`;
    doc.image = url;
  }
});
// Mongoose post hook that modifies the 'image' field after a document is saved to the database
brandSchema.post("save", (doc) => {
  // Append the base URL and port to the image field, if it exists, to create a full URL
  if (doc.image) {
    const url = `${process.env.BASE_URL}:${process.env.PORT}/brands/${doc.image}`;
    doc.image = url;
  }
});

// Create the brand model from the schema
const brandModel = mongoose.model("Brand", brandSchema);
export default brandModel;
