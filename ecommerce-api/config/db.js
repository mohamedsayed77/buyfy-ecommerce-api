import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbLink = process.env.DB_LINK;

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
