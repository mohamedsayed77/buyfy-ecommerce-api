import expressAsyncHandler from "express-async-handler";

import brandModel from "../models/brandModel.js";
import ApiError from "../utils/ApiError.js";
import ApiFeatures from "../utils/apiFeatures.js";

// @description    create a brand
// @route          Post  /api/v1/brands
//  @access        Private
const createBrand = expressAsyncHandler(async (req, res) => {
  const brand = await brandModel.create(req.body);
  res.status(201).json({ data: brand });
});

// @discussion   Get list of brands
// @route        Get /api/v1/brands
// @access       public
const getBrands = expressAsyncHandler(async (req, res) => {
  // build the query
  const documentsCount = await brandModel.countDocuments();
  const apiFeatures = new ApiFeatures(brandModel.find(), req.query)
    .paginate(documentsCount)
    .filter()
    .search()
    .sort()
    .limitFields();

  const { query, paginationResult } = apiFeatures;

  // execute the query
  const brands = await query;

  res
    .status(200)
    .json({ results: brands.length, paginationResult, data: brands });
});

// @discussion   Get specific brand by id
// @route        Get /api/v1/brands/:id
// @access       public
const getBrand = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const brand = await brandModel.findById(id);

  if (!brand) {
    return next(new ApiError(`No brand for this id ${id}`, 404));
  }

  res.status(200).json({ data: brand });
});

// @description    update specific brand
// @route          Post  /api/v1/brands/:id
// @access        private
const updateBrand = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const brand = await brandModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });

  if (!brand) {
    return next(new ApiError(`No brand for this id ${id}`, 404));
  }

  res.status(200).json({ data: brand });
});

// @description    delete specific brand
// @route          Delete  /api/v1/brands/:id
// @access        private
const deleteBrand = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const brand = await brandModel.findByIdAndDelete(id);

  if (!brand) {
    return next(new ApiError(`No brand for this id ${id}`, 404));
  }

  res.status(204).send();
});

export default {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
};
