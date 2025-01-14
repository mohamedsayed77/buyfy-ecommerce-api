import multer from "multer";
import ApiError from "../utils/ApiError.js";

const multerSetup = () => {
  const multerStorage = multer.memoryStorage();

  const fileFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only Images are allowed.", 400), false);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: fileFilter });

  return upload;
};

// Upload a single image
const uploadSingleImage = (fieldName) => multerSetup().single(fieldName);

// Upload multiple images
const uploadMixImages = (arrayOfFields) => multerSetup().fields(arrayOfFields);

export default {
  uploadSingleImage,
  uploadMixImages,
};
