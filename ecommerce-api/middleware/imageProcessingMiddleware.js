import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import AsyncHandler from "express-async-handler";

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

export default { resizeCategoryImage };
