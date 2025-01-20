import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name required"],
    trim: true,
  },
  slug: {
    type: String,
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, "email required"],
    unique: true,
    lowercase: true,
  },
  phone: String,
  profileImg: String,
  password: {
    type: String,
    required: [true, "password required"],
    minlength: [8, "password must be at least 8 characters long"],
  },
  passwordChangedAt: Date,
  passwordResetCode: String,
  passwordResetExpiresAt: Date,
  passwordResetVerified: Boolean,

  role: {
    type: String,
    enum: ["user", "manger", "admin"],
    default: "user",
  },
  active: {
    type: Boolean,
    default: true,
  },
});

const User = mongoose.model("User", userSchema);
export default User;
