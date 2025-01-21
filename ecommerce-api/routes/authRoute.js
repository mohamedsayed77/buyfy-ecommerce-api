import express from "express";

import authService from "../services/authService.js";
import authValidator from "../utils/validators/authValidator.js";

const { signup, login, forgetPassword, resetPassword } = authService;

const {
  signupValidator,
  loginValidator,

  forgetPaswordValidator,
  resetPasswordValidator,
} = authValidator;

const router = express.Router();

router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);

router.post("/forgetPassword", forgetPaswordValidator, forgetPassword);
router.post("/resetPassword", resetPasswordValidator, resetPassword);

export default router;
