import mongoose from "mongoose";

// Define the category schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required."],
      unique: [true, "Category name must be unique."],
      minlength: [2, "Category name must be at least 2 characters long."],
      maxlength: [32, "Category name must be at most 32 characters long."],
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

// Mongoose post hook that modifies the 'image' field after a document is initialized (retrieved from the database)
categorySchema.post("init", (doc) => {
  // Append the base URL and port to the image field, if it exists, to create a full URL
  if (doc.image) {
    const url = `${process.env.BASE_URL}:${process.env.PORT}/categories/${doc.image}`;
    doc.image = url;
  }
});
// Mongoose post hook that modifies the 'image' field after a document is saved to the database
categorySchema.post("save", (doc) => {
  // Append the base URL and port to the image field, if it exists, to create a full URL
  if (doc.image) {
    const url = `${process.env.BASE_URL}:${process.env.PORT}/categories/${doc.image}`;
    doc.image = url;
  }
});

// Create the category model from the schema
const categoryModel = mongoose.model("Category", categorySchema);
export default categoryModel;
