import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/**
 * User Schema Definition
 * - Defines the structure and validation rules for the User model.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true, // Removes leading and trailing whitespace
    },
    slug: {
      type: String,
      lowercase: true, // Ensures the slug is stored in lowercase
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true, // Ensures unique emails
      lowercase: true, // Ensures the email is stored in lowercase
    },
    phone: String, // Optional phone number
    profileImg: String, // URL or filename of the user's profile image
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [8, "Password must be at least 8 characters long."],
    },
    passwordChangedAt: Date, // Tracks the last time the user changed their password
    passwordResetCode: String, // Code for resetting the password
    passwordResetExpiresAt: Date, // Expiration time for the password reset code

    // Wishlist: Array of product references (1-to-many relationship)
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // References the Product model
      },
    ],

    // Addresses: Embedded array of address objects
    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String, // Friendly name for the address (e.g., "Home", "Work")
        details: String, // Full address details
        phone: String, // Contact number for the address
        city: String, // City of the address
        postalCode: String, // Postal code of the address
      },
    ],

    role: {
      type: String,
      enum: ["user", "manager", "admin"], // Restricts role to specific values
      default: "user", // Default role is "user"
    },
    active: {
      type: Boolean,
      default: true, // Indicates if the user account is active
    },
    reactivationInProgress: {
      type: Boolean,
      default: false, // Indicates if account reactivation is in progress
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

/**
 * Pre-Save Middleware
 * - Hashes the password before saving it to the database.
 * - Executes only if the password field is modified.
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Skip if password isn't modified
  this.password = await bcrypt.hash(this.password, 12); // Hash the password with bcrypt
  next();
});

/**
 * User Model
 * - Represents the User entity in the database.
 */
const User = mongoose.model("User", userSchema);

export default User;
