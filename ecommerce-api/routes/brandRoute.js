import express from "express";
import brandService from "../services/brandService.js";
import brandValidator from "../utils/validators/brandValidator.js";

const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = brandValidator;

const { getBrands, createBrand, getBrand, updateBrand, deleteBrand } =
  brandService;

const router = express.Router();

router.route("/").get(getBrands).post(createBrandValidator, createBrand);

router
  .route("/:id")
  .get(getBrandValidator, getBrand)

  .put(updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);

export default router;
