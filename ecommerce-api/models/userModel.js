import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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

  // child references: 1 to many
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],

  role: {
    type: String,
    enum: ["user", "manger", "admin"],
    default: "user",
  },
  active: {
    type: Boolean,
    default: true,
  },
  reactivationInProgress: { type: Boolean, default: false },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
