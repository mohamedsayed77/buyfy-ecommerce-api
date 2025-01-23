import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import AsyncHandler from "express-async-handler";

/**
 * Middleware to resize and process profile images
 */
const resizeProfileImage = () =>
  AsyncHandler(async (req, res, next) => {
    if (req.file) {
      const filename = `profile-${uuidv4()}-${Date.now()}.jpeg`;

      await sharp(req.file.buffer)
        .resize(1920, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`uploads/profiles/${filename}`);

      // Attach the processed file to the request body
      req.body.profileImg = filename;
    }
    next();
  });

/**
 * Middleware to resize and process category images
 */
const resizeCategoryImage = () =>
  AsyncHandler(async (req, res, next) => {
    if (req.file) {
      const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

      await sharp(req.file.buffer)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`uploads/categories/${filename}`);

      // Attach the processed file to the request body
      req.body.image = filename;
    }
    next();
  });

/**
 * Middleware to resize and process brand images
 */
const resizeBrandImage = () =>
  AsyncHandler(async (req, res, next) => {
    if (req.file) {
      const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;

      await sharp(req.file.buffer)
        .resize(1920, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`uploads/brands/${filename}`);

      // Attach the processed file to the request body
      req.body.image = filename;
    }
    next();
  });

/**
 * Middleware to optionally resize and process product images
 */
const resizeProductImages = AsyncHandler(async (req, res, next) => {
  if (req.files) {
    // Process the main product image (imageCover)
    if (req.files.imageCover && req.files.imageCover[0]) {
      const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

      await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`uploads/products/${imageCoverFileName}`);

      // Attach the processed file to the request body
      req.body.imageCover = imageCoverFileName;
    }

    // Process additional product images (images)
    if (req.files.images && req.files.images.length > 0) {
      req.body.images = [];
      await Promise.all(
        req.files.images.map(async (image, index) => {
          const imageFileName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

          await sharp(image.buffer)
            .resize(2000, 1333)
            .toFormat("jpeg")
            .jpeg({ quality: 95 })
            .toFile(`uploads/products/${imageFileName}`);

          // Attach the processed image to the request body
          req.body.images.push(imageFileName);
        })
      );
    }
  }

  next();
});

export default {
  resizeCategoryImage,
  resizeBrandImage,
  resizeProductImages,
  resizeProfileImage,
};
