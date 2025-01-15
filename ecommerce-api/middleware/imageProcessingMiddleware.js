import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import AsyncHandler from "express-async-handler";

// Function to resize category images
const resizeCategoryImage = () =>
  AsyncHandler(async (req, res, next) => {
    if (req.file) {
      const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

      await sharp(req.file.buffer)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`uploads/categories/${filename}`);

      // save the image to the database
      req.body.image = filename;
    }

    next();
  });

// Function to resize brand images
const resizeBrandImage = () =>
  AsyncHandler(async (req, res, next) => {
    if (req.file) {
      const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;

      await sharp(req.file.buffer)
        .resize(1920, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`uploads/brands/${filename}`);

      // save the image to the database
      req.body.image = filename;
    }
    next();
  });

// Middleware to resize product images
const resizeProductImages = AsyncHandler(async (req, res, next) => {
  // image processing for imageCover
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    // save the imageCover to the database
    req.body.imageCover = imageCoverFileName;
  }

  // image processing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (image, index) => {
        const imageFileName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(image.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageFileName}`);

        // save the image to the database
        req.body.images.push(imageFileName);
      })
    );
  }
  next();
});

export default { resizeCategoryImage, resizeBrandImage, resizeProductImages };
