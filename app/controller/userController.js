const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const UserModel = require("../models/users");
const cloudinary = require("cloudinary").v2;

class userController {
  async userRegister(req, res) {
    try {
      const { userName, email, password, licenseNumber } = req.body;
      const exists = await UserModel.findOne({ email });
      if (exists) {
        return res.status(401).json({
          success: false,
          message: "User already exists",
        });
      }

      const hashed = await bcrypt.hash(password, 10);
      const user = await UserModel.create({
        userName,
        email,
        password: hashed,
        licenseNumber,
      });

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
          userId: user._id,
          userName: user.userName,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }

  async userLogin(req, res) {
    try {
      const { email, password } = req.body;

      console.log(req.body);

      // Validate
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      // Find admin
      const user = await UserModel.findOne({ email });

      if (!user || user.role !== "customer") {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access",
        });
      }

      // Check active status
      if (user.isActive !== "Active") {
        return res.status(403).json({
          success: false,
          message: "User account is inactive",
        });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Tokens
      const userAccessToken = jwt.sign(
        {
          userId: user._id,
          userName: user.userName,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "15m" },
      );

      const userRefreshToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_REFRESH_SECRET_KEY,
        { expiresIn: "7d" },
      );

      // Save
      user.refreshToken = userRefreshToken;
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          userId: user._id,
          userName: user.userName,
          email: user.email,
          role: user.role,
        },
        tokens: {
          accessToken: userAccessToken,
          refreshToken: userRefreshToken,
        },
      });
    } catch (error) {
      console.error("User Login Error:", error);

      return res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  }
}

module.exports = new userController();
