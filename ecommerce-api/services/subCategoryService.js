import expressAsyncHandler from "express-async-handler";

import SubCategoryModel from "../models/subCategoryModel.js";
import ApiError from "../utils/ApiError.js";
import ApiFeatures from "../utils/apiFeatures.js";

// @description    create a new subcategory
// @route          Post  /api/v1/subcategories
//  @access        Private
const createSubCategory = expressAsyncHandler(async (req, res) => {
  const subCategory = await SubCategoryModel.create(req.body);
  res.status(201).json({ data: subCategory });
});

// @discussion   Get list of subcategories
// @route        Get /api/v1/subcategories
// @access       public
const getSubCategories = expressAsyncHandler(async (req, res) => {
  // build the query
  const documentsCount = await SubCategoryModel.countDocuments();
  const apiFeatures = new ApiFeatures(SubCategoryModel.find(), req.query)
    .paginate(documentsCount)
    .filter(req)
    .search()
    .sort()
    .limitFields();

  const { query, paginationResult } = apiFeatures;

  // execute the query
  const subCategories = await query;

  // Send the response
  res.status(200).json({
    results: subCategories.length,
    paginationResult,
    data: subCategories,
  });
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

  const subcategory = await SubCategoryModel.findOneAndUpdate(
    { _id: id },
    req.body,
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
