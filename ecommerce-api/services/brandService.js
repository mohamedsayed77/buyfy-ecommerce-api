import slugify from "slugify";
import expressAsyncHandler from "express-async-handler";
import brandModel from "../models/brandModel.js";
import ApiError from "../utils/ApiError.js";

// @description    create a brand
// @route          Post  /api/v1/brands
//  @access        Private
const createBrand = expressAsyncHandler(async (req, res) => {
  const { name } = req.body;
  const slug = slugify(name, { lower: true });

  const brand = await brandModel.create({ name, slug });
  res.status(201).json({ data: brand });
});

// @discussion   Get list of brands
// @route        Get /api/v1/brands
// @access       public
const getBrands = expressAsyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit; // (2-1) *5 = 5

  const brands = await brandModel.find().skip(skip).limit(limit);

  res.status(200).json({ results: brands.length, page, data: brands });
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
  const { name } = req.body;

  const brand = await brandModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );

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
