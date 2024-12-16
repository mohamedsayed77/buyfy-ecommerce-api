import slugify from "slugify";
import expressAsyncHandler from "express-async-handler";
import categoryModel from "../models/categoryModel.js";
import ApiError from "../utils/ApiError.js";

// @discussion   Get list of categories
// @route        Get /api/v1/categories
// @access       public
const getCategories = expressAsyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit; // (2-1) *5 = 5

  const categories = await categoryModel.find({}).skip(skip).limit(limit);

  res.status(200).json({ results: categories.length, page, data: categories });
});

// @discussion   Get specific category by id
// @route        Get /api/v1/categories/:id
// @access       public
const getCategory = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await categoryModel.findById(id);

  if (!category) {
    return next(new ApiError(`No category for this id ${id}`, 404));
  }

  res.status(200).json({ data: category });
});

// @description    create a category
// @route          Post  /api/v1/categories
//  @access        Private
const createCategory = expressAsyncHandler(async (req, res) => {
  const { name } = req.body;
  const slug = slugify(name, { lower: true });

  const category = await categoryModel.create({ name, slug });
  res.status(201).json({ data: category });
});

// @description    update specific category
// @route          Post  /api/v1/categories/:id
// @access        private
const updateCategory = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const category = await categoryModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );

  if (!category) {
    return next(new ApiError(`No category for this id ${id}`, 404));
  }

  res.status(200).json({ data: category });
});

// @description    delete specific category
// @route          Delete  /api/v1/categories/:id
// @access        private
const deleteCategory = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await categoryModel.findByIdAndDelete(id);

  if (!category) {
    return next(new ApiError(`No category for this id ${id}`, 404));
  }

  res.status(204).send();
});

export default {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
