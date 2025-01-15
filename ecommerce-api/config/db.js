import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Retrieve the database link from environment variable
const dbLink = process.env.DB_LINK;

// Function to connect to the MongoDB database
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(dbLink);
    console.log(`DATA: ${connection.connection.host}`);
  } catch (error) {
    console.error(`Database Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
