import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import ApiError from "./utils/ApiError.js";
import globalError from "./middleware/errorMiddleware.js";

import categoryRoute from "./routes/categoryRoute.js";
import subCategoryRoute from "./routes/subCategoryRoute.js";

dotenv.config();

// Connect to the database
connectDB();

// Initialize express app
const app = express();

// Middleware to parse JSON
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}
// mount the router
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subCategoryRoute);

// Error handling middleware for non-existing routes
app.all("*", (req, res, next) => {
  next(new ApiError(`Cant't find this route: ${req.originalUrl}`, 400));
});

// Error handling middleware for async/await
app.use(globalError);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handling unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Errors: ${err.name} | ${err.message}`);

  server.close(() => {
    console.error("Server is shutting down");
    process.exit(1);
  });
});
