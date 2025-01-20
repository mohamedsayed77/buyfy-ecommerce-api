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
import userRoute from "./routes/userRoute.js";

// Load environment variables from the .env file
dotenv.config();

// Connect to the database
connectDB();

// Initialize express app
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the "uploads" directory
app.use(express.static(path.join(process.cwd(), "uploads")));

// Enable detailed request logging and output the current mode in development environment
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}
// Route handlers for different endpoints
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subCategoryRoute);
app.use("/api/v1/brands", brandRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/users", userRoute);

// Handle all undefined routes
app.all("*", (req, res, next) => {
  next(new ApiError(`Cant't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware
app.use(globalError);

// Start the server and listen on the specified port
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Errors: ${err.name} | ${err.message}`);

  // Close the server and exit the process
  server.close(() => {
    console.error("Server is shutting down");
    process.exit(1);
  });
});
