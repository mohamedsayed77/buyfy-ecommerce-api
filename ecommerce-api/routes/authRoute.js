import express from "express";
import authService from "../services/authService.js";

const { signup, login } = authService;

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

export default router;
