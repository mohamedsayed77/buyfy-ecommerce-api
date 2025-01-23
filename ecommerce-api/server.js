import path from "path";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import ApiError from "./utils/ApiError.js";
import globalError from "./middleware/errorMiddleware.js";

import categoryRoute from "./routes/categoryRoute.js";
import subCategoryRoute from "./routes/subCategoryRoute.js";
import brandRoute from "./routes/brandRoute.js";
import productRoute from "./routes/productRoute.js";
import adminRoute from "./routes/adminRoute.js";
import authRoute from "./routes/authRoute.js";
import meRoute from "./routes/meRoute.js";
import reviewRoute from "./routes/reviewRoute.js";
import wishListRoute from "./routes/wishlistRoute.js";
import addressRoute from "./routes/addressRoute .js";

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

// Initialize express app
const app = express();

// Middleware to parse incoming JSON payloads
app.use(express.json());

// Serve static files from the "uploads" directory
app.use(express.static(path.join(process.cwd(), "uploads")));

// Enable logging for requests in development mode
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`Application running in ${process.env.NODE_ENV} mode`);
}

// Mount route handlers
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subCategoryRoute);
app.use("/api/v1/brands", brandRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/me", meRoute);
app.use("/api/v1/reviews", reviewRoute);
app.use("/api/v1/wishlist", wishListRoute);
app.use("/api/v1/address", addressRoute);

// Handle undefined routes
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware
app.use(globalError);

// Start the server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Gracefully handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.name} | ${err.message}`);

  // Close the server and exit the process
  server.close(() => {
    console.error("Server shutting down due to unhandled rejection");
    process.exit(1);
  });
});
