const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { protect, JWT_SECRET } = require("../middleware/authMiddleware");

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });
};

// @route   POST /api/users/register
// @desc    Register a new user (always role 'user' for safety)
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields (name, email, password)" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "user",
      ecoPoints: 0
    });

    const token = generateToken(user._id);

    // Create a welcome notification
    await Notification.create({
      user: user._id,
      title: "Welcome to EcoSort!",
      message: "Start logging your waste disposal to earn EcoPoints and boost your Material Recovery Score.",
      type: "SYSTEM"
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ecoPoints: user.ecoPoints
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: error.message
    });
  }
});

// @route   POST /api/users/login
// @desc    Authenticate user and return JWT
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "user",
        ecoPoints: user.ecoPoints || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
});

// @route   POST /api/users/admin-login
// @desc    Authenticate specifically as administrator
// @access  Public
router.post("/admin-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide admin email and password" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        message: "Invalid administrator credentials."
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Access Denied: This account does not possess administrator privileges. Please use standard member login."
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid administrator credentials."
      });
    }

    const token = generateToken(user._id);

    res.json({
      message: "Administrator authentication successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ecoPoints: user.ecoPoints || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Admin login failed",
      error: error.message
    });
  }
});

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
});

// @route   PUT /api/users/profile
// @desc    Update current user profile
// @access  Private
router.put("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, currentPassword, newPassword } = req.body;

    if (name) {
      user.name = name.trim();
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required to set a new password" });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect current password" });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters long" });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ecoPoints: user.ecoPoints
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Profile update failed", error: error.message });
  }
});

// @route   GET /api/users/notifications
// @desc    Get user notifications
// @access  Private
router.get("/notifications", protect, async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [{ user: req.user._id }, { user: null }]
    })
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({
      $or: [{ user: req.user._id }, { user: null }],
      read: false
    });

    res.json({
      success: true,
      notifications,
      unreadCount
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications", error: error.message });
  }
});

// @route   PATCH /api/users/notifications/:id/read
// @desc    Mark a notification as read
// @access  Private
router.patch("/notifications/:id/read", protect, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ message: "Failed to update notification", error: error.message });
  }
});

module.exports = router;