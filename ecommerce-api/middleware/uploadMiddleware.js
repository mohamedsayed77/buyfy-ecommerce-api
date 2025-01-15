import multer from "multer";
import ApiError from "../utils/ApiError.js";

// Setup Multer for file uploads
const multerSetup = () => {
  // Store files in memory
  const multerStorage = multer.memoryStorage();
  // File filter to only allow images
  const fileFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only Images are allowed.", 400), false);
    }
  };
  // Create the Multer upload instance with storage and file filter
  const upload = multer({ storage: multerStorage, fileFilter: fileFilter });

  // Return the configured Multer instance
  return upload;
};

// Function to configure and return middleware for uploading a single image
const uploadSingleImage = (fieldName) => multerSetup().single(fieldName);

// Function to configure and return middleware for uploading multiple images
const uploadMixImages = (arrayOfFields) => multerSetup().fields(arrayOfFields);

export default {
  uploadSingleImage,
  uploadMixImages,
};
