import slugify from "slugify";
import expressAsyncHandler from "express-async-handler";

import SubCategoryModel from "../models/subCategoryModel.js";

// @description    create a subcategory
// @route          Post  /api/v1/subcategories
//  @access        Private
const createSubCategory = expressAsyncHandler(async (req, res) => {
  const { name, category } = req.body;
  const slug = slugify(name, { lower: true });

  const subCategory = await SubCategoryModel.create({
    name,
    slug,
    category,
  });
  res.status(201).json({ data: subCategory });
});

export default {
  createSubCategory,
};
