import express from "express";
import authService from "../services/authService.js";
import authValidator from "../utils/validators/authValidator.js";

const { signupValidator, loginValidator, forgetPaswordValidator } =
  authValidator;

const { signup, login, forgetPassword } = authService;

const router = express.Router();

router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);
router.post("/forgetPassword", forgetPaswordValidator, forgetPassword);

export default router;
