const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

const AdminModel = require("../models/admin");
const UserModel = require("../models/users");

const cloudinary = require("cloudinary").v2;


class adminController {
  async adminRegister(req, res) {
    try {
      const { adminName, email, password, phone } = req.body;

      // basic validation
      if (!adminName || !email || !password || !phone) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      // check existing admin
      const existingAdmin = await AdminModel.findOne({ email });
      if (existingAdmin) {
        return res.status(409).json({
          success: false,
          message: "Admin already exists with this email",
        });
      }

      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // create admin
      const newAdmin = await AdminModel.create({
        adminName,
        email,
        password: hashedPassword,
        phone,
      });

      return res.status(201).json({
        success: true,
        message: "Admin registered successfully",
        data: {
          id: newAdmin._id,
          adminName: newAdmin.adminName,
          email: newAdmin.email,
          phone: newAdmin.phone,
          role: newAdmin.role,
          isActive: newAdmin.isActive,
          createdAt: newAdmin.createdAt,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  }

  async adminLogin(req, res) {
    try {
      const { email, password } = req.body;

      console.log(req.body)

      // Validate
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      // Find admin
      const user = await AdminModel.findOne({ email });

      if (!user || user.role !== "admin") {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access",
        });
      }

      // Check active status
      if (user.isActive !== "Active") {
        return res.status(403).json({
          success: false,
          message: "Admin account is inactive",
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
      const adminAccessToken = jwt.sign(
        {
          userId: user._id,
          adminName: user.adminName,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "15m" },
      );

      const adminRefreshToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_REFRESH_SECRET_KEY,
        { expiresIn: "7d" },
      );

      // Save
      user.refreshToken = adminRefreshToken;
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          adminId: user._id,
          adminName: user.adminName,
          email: user.email,
          role: user.role,
        },
        tokens: {
          accessToken: adminAccessToken,
          refreshToken: adminRefreshToken,
        },
      });
    } catch (error) {
      console.error("Admin Login Error:", error);

      return res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  }
}

module.exports = new adminController();
