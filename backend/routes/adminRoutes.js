const express = require("express");
const User = require("../models/User");
const WasteRecord = require("../models/WasteRecord");
const Bin = require("../models/Bin");
const EcoPointTransaction = require("../models/EcoPointTransaction");
const Notification = require("../models/Notification");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// @route   POST /api/admin/setup-first-admin
// @desc    Promote the first admin if NO admin exists in the database
// @access  Private (any logged-in user, but ONLY if 0 admins exist)
router.post("/setup-first-admin", protect, async (req, res) => {
  try {
    const existingAdminCount = await User.countDocuments({ role: "admin" });

    if (existingAdminCount > 0) {
      return res.status(403).json({
        message: "An administrator already exists. Contact your administrator for role updates."
      });
    }

    const user = await User.findById(req.user._id);
    user.role = "admin";
    await user.save();

    res.json({
      success: true,
      message: `User ${user.email} has been designated as the primary Administrator.`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Admin bootstrap failed", error: error.message });
  }
});

// @route   GET /api/admin/overview
// @desc    System-wide statistics and metrics
// @access  Private/Admin
router.get("/overview", protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const bins = await Bin.find();
    const totalBins = bins.length;
    const fullBins = bins.filter((b) => b.simulatedFillPercentage >= 90).length;
    const almostFullBins = bins.filter(
      (b) => b.simulatedFillPercentage >= 70 && b.simulatedFillPercentage < 90
    ).length;

    const allRecords = await WasteRecord.find().populate("user", "name email");

    let totalWasteKg = 0;
    const categoryDistribution = {
      plastic: 0,
      paper: 0,
      metal: 0,
      glass: 0,
      cardboard: 0,
      organic: 0,
      "e-waste": 0,
      other: 0
    };

    allRecords.forEach((rec) => {
      totalWasteKg += rec.quantity;
      if (categoryDistribution[rec.wasteCategory] !== undefined) {
        categoryDistribution[rec.wasteCategory] = Number(
          (categoryDistribution[rec.wasteCategory] + rec.quantity).toFixed(2)
        );
      }
    });

    const recentRecords = await WasteRecord.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("user", "name email");

    res.json({
      success: true,
      metrics: {
        totalUsers,
        totalWasteKg: Number(totalWasteKg.toFixed(2)),
        totalBins,
        fullBins,
        almostFullBins,
        totalDisposalTransactions: allRecords.length,
        categoryDistribution
      },
      bins,
      recentActivity: recentRecords
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admin overview", error: error.message });
  }
});

// @route   GET /api/admin/users
// @desc    List all registered users with their statistics
// @access  Private/Admin
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const wasteCount = await WasteRecord.countDocuments({ user: u._id });
        return {
          id: u._id,
          name: u.name,
          email: u.email,
          role: u.role || "user",
          ecoPoints: u.ecoPoints || 0,
          totalDisposals: wasteCount,
          createdAt: u.createdAt
        };
      })
    );

    res.json({ success: true, users: usersWithStats });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
});

// @route   PATCH /api/admin/users/:id/role
// @desc    Update a user's role (user or admin)
// @access  Private/Admin
router.patch("/users/:id/role", protect, adminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Role must be 'user' or 'admin'" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.email} updated to role: ${role}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update role", error: error.message });
  }
});

// @route   GET /api/admin/waste-records
// @desc    Get all waste disposal records across all users
// @access  Private/Admin
router.get("/waste-records", protect, adminOnly, async (req, res) => {
  try {
    const records = await WasteRecord.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email");

    res.json({ success: true, records });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch waste records", error: error.message });
  }
});

// @route   DELETE /api/admin/waste-records/:id
// @desc    Remove an invalid record and deduct points
// @access  Private/Admin
router.delete("/waste-records/:id", protect, adminOnly, async (req, res) => {
  try {
    const record = await WasteRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    // Deduct points from user
    if (record.pointsEarned > 0) {
      await User.findByIdAndUpdate(record.user, {
        $inc: { ecoPoints: -record.pointsEarned }
      });

      await EcoPointTransaction.create({
        user: record.user,
        transactionType: "REWARD_REDEEM",
        pointsAmount: -record.pointsEarned,
        description: `Administrative adjustment: record for ${record.quantity} kg of ${record.wasteCategory} removed.`
      });
    }

    await WasteRecord.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Waste record removed and points adjusted." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete waste record", error: error.message });
  }
});

module.exports = router;
