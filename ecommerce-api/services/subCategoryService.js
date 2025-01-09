import slugify from "slugify";
import expressAsyncHandler from "express-async-handler";

import SubCategoryModel from "../models/subCategoryModel.js";
import ApiError from "../utils/ApiError.js";

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

// @discussion   Get list of subcategories
// @route        Get /api/v1/subcategories
// @access       public
const getSubCategories = expressAsyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit; // (2-1) *5 = 5

  const subCategories = await SubCategoryModel.find(req.filterObject)
    .skip(skip)
    .limit(limit);

  res
    .status(200)
    .json({ results: subCategories.length, page, data: subCategories });
});

// @discussion   Get specific subcategory by id
// @route        Get /api/v1/subcategories/:id
// @access       public
const getSubCategory = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const subCategory = await SubCategoryModel.findById(id);

  if (!subCategory) {
    return next(new ApiError(`No category for this id ${id}`, 404));
  }

  res.status(200).json({ data: subCategory });
});
// @description    update specific subcategory
// @route          Post  /api/v1/subcategories/:id
// @access        private
const updateSubCategory = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;

  const subcategory = await SubCategoryModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name), category },
    { new: true }
  );

  if (!subcategory) {
    return next(new ApiError(`No subCategory for this id ${id}`, 404));
  }

  res.status(200).json({ data: subcategory });
});

// @description    delete specific subcategory
// @route          Delete  /api/v1/subcategories/:id
// @access        private
const deleteSubCategory = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const subCategory = await SubCategoryModel.findByIdAndDelete(id);

  if (!subCategory) {
    return next(new ApiError(`No subCategory for this id ${id}`, 404));
  }

  res.status(204).send();
});

export default {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
