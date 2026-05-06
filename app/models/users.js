const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    licenseNumber: {
      type: String,
      default: null,
    },
    licenseFile: {
      type: String,
      default: null,
    },
    isLicenseVerified: {
      type: Boolean,
      default: false,
    },
    isActive:{
      type: String,
      enum: ["Active","Inactive"],
      default: "Active"
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    refreshToken: { type: String, default: null },
  },
  { timestamps: true, versionKey: false },
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
