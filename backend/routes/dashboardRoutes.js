const express = require("express");
const WasteRecord = require("../models/WasteRecord");
const Bin = require("../models/Bin");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const MRS_WEIGHTS = {
  metal: 0.95,
  glass: 0.90,
  "e-waste": 0.88,
  organic: 0.85,
  paper: 0.80,
  cardboard: 0.80,
  plastic: 0.75,
  other: 0.40
};

// @route   GET /api/dashboard/stats
// @desc    Get personalized statistics for the user dashboard
// @access  Private
router.get("/stats", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch refreshed user
    const user = await User.findById(userId).select("ecoPoints name email role");

    // Fetch waste records
    const records = await WasteRecord.find({ user: userId }).sort({ disposalDate: -1 });

    let totalWasteKg = 0;
    let totalWeightedRecovery = 0;
    const categoryTotals = {
      plastic: 0,
      paper: 0,
      metal: 0,
      glass: 0,
      cardboard: 0,
      organic: 0,
      "e-waste": 0,
      other: 0
    };

    records.forEach((rec) => {
      totalWasteKg += rec.quantity;
      const weight = MRS_WEIGHTS[rec.wasteCategory] || 0.4;
      totalWeightedRecovery += rec.quantity * weight;
      if (categoryTotals[rec.wasteCategory] !== undefined) {
        categoryTotals[rec.wasteCategory] = Number(
          (categoryTotals[rec.wasteCategory] + rec.quantity).toFixed(2)
        );
      }
    });

    const materialRecoveryScore =
      totalWasteKg > 0 ? Math.round((totalWeightedRecovery / totalWasteKg) * 100) : 0;

    // Recent 5 activity records
    const recentActivity = records.slice(0, 5);

    // Bins overview
    const bins = await Bin.find();
    const availableBinsCount = bins.filter((b) => b.status === "Available").length;

    res.json({
      success: true,
      stats: {
        ecoPoints: user.ecoPoints || 0,
        totalWasteKg: Number(totalWasteKg.toFixed(2)),
        totalContributions: records.length,
        materialRecoveryScore,
        categoryTotals,
        availableBinsCount,
        totalBinsCount: bins.length
      },
      recentActivity,
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard stats", error: error.message });
  }
});

module.exports = router;
