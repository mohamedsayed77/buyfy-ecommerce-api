import express from "express";
import authService from "../services/authService.js";
import authValidator from "../utils/validators/authValidator.js";

const { signupValidator, loginValidator } = authValidator;

const { signup, login } = authService;

const router = express.Router();

router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);

export default router;
