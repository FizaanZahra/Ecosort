const express = require("express");
const WasteRecord = require("../models/WasteRecord");
const User = require("../models/User");
const Bin = require("../models/Bin");
const EcoPointTransaction = require("../models/EcoPointTransaction");
const Notification = require("../models/Notification");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Points awarded per kilogram
const POINT_RATES_PER_KG = {
  plastic: 15,
  paper: 10,
  metal: 20,
  glass: 25,
  cardboard: 10,
  other: 5
};

// Category recyclability weights for transparent Material Recovery Score (MRS)
const MRS_WEIGHTS = {
  metal: 0.95,
  glass: 0.90,
  paper: 0.80,
  cardboard: 0.80,
  plastic: 0.75,
  other: 0.40
};

// Helper to compute user's cumulative MRS
const calculateCumulativeMRS = async (userId) => {
  const records = await WasteRecord.find({ user: userId });
  if (!records || records.length === 0) return 0;

  let totalKg = 0;
  let totalWeightedRecovery = 0;

  for (const rec of records) {
    const weight = MRS_WEIGHTS[rec.wasteCategory] || 0.4;
    totalKg += rec.quantity;
    totalWeightedRecovery += rec.quantity * weight;
  }

  if (totalKg === 0) return 0;
  return Math.round((totalWeightedRecovery / totalKg) * 100);
};

// @route   POST /api/waste
// @desc    Record waste disposal, award points, update simulated bin, log transaction
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { wasteCategory, quantity, binId, description } = req.body;

    if (!wasteCategory || !quantity) {
      return res.status(400).json({ message: "Waste category and quantity are required." });
    }

    const normalizedCategory = wasteCategory.toLowerCase().trim();
    if (!POINT_RATES_PER_KG[normalizedCategory]) {
      return res.status(400).json({
        message: `Invalid category. Must be one of: ${Object.keys(POINT_RATES_PER_KG).join(", ")}`
      });
    }

    const parsedQuantity = parseFloat(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return res.status(400).json({ message: "Quantity must be a positive number." });
    }

    if (parsedQuantity > 500) {
      return res.status(400).json({ message: "Quantity exceeds maximum allowable single disposal (500 kg)." });
    }

    // 1. Calculate points earned
    const rate = POINT_RATES_PER_KG[normalizedCategory];
    const pointsEarned = Math.max(5, Math.round(parsedQuantity * rate));

    // 2. Calculate MRS factor for this entry
    const recordMRS = Math.round((MRS_WEIGHTS[normalizedCategory] || 0.4) * 100);

    // 3. Resolve Bin if selected
    let binDoc = null;
    let binName = "EcoSort General Bin";

    if (binId) {
      binDoc = await Bin.findById(binId);
      if (binDoc) {
        binName = binDoc.name;
        // Update simulated fill level
        binDoc.currentFillKg = (binDoc.currentFillKg || 0) + parsedQuantity;
        binDoc.simulatedFillPercentage = Math.min(
          100,
          Math.round((binDoc.currentFillKg / binDoc.capacityKg) * 100)
        );
        binDoc.updateStatusFromFill();
        binDoc.lastUpdated = new Date();
        await binDoc.save();

        // If bin reached Full or Almost Full, trigger alert notification
        if (binDoc.simulatedFillPercentage >= 90) {
          await Notification.create({
            user: null, // Broadcast notification to all / admins
            title: `Bin Alert: ${binDoc.name} is ${binDoc.simulatedFillPercentage}% Full`,
            message: `The ${binDoc.name} bin at ${binDoc.location} has reached capacity and requires collection.`,
            type: "BIN_ALERT"
          });
        }
      }
    }

    // 4. Create the waste record
    const wasteRecord = await WasteRecord.create({
      user: req.user._id,
      wasteCategory: normalizedCategory,
      quantity: parsedQuantity,
      unit: "kg",
      bin: binDoc ? binDoc._id : null,
      binName,
      pointsEarned,
      materialRecoveryScore: recordMRS,
      description: description ? description.trim() : "",
      disposalDate: new Date()
    });

    // 5. Update user points balance
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { ecoPoints: pointsEarned } },
      { new: true }
    );

    // 6. Record auditable points transaction
    await EcoPointTransaction.create({
      user: req.user._id,
      transactionType: "DISPOSAL_REWARD",
      pointsAmount: pointsEarned,
      wasteRecord: wasteRecord._id,
      description: `Disposed ${parsedQuantity} kg of ${normalizedCategory} waste at ${binName}`
    });

    // 7. Create notification for the user
    await Notification.create({
      user: req.user._id,
      title: "Disposal Recorded & Points Earned!",
      message: `You earned +${pointsEarned} EcoPoints for responsibly disposing of ${parsedQuantity} kg of ${normalizedCategory}.`,
      type: "POINTS"
    });

    // 8. Re-evaluate overall MRS
    const cumulativeMRS = await calculateCumulativeMRS(req.user._id);

    res.status(201).json({
      success: true,
      message: `Disposal recorded successfully! +${pointsEarned} EcoPoints awarded.`,
      record: wasteRecord,
      pointsEarned,
      newTotalPoints: updatedUser.ecoPoints,
      materialRecoveryScore: cumulativeMRS
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to record disposal", error: error.message });
  }
});

// @route   GET /api/waste/history
// @desc    Get user's personal waste disposal history with filtering and pagination
// @access  Private
router.get("/history", protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { user: req.user._id };

    if (req.query.category && req.query.category !== "all") {
      filter.wasteCategory = req.query.category.toLowerCase();
    }

    const totalRecords = await WasteRecord.countDocuments(filter);
    const records = await WasteRecord.find(filter)
      .sort({ disposalDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      records,
      pagination: {
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch waste history", error: error.message });
  }
});

// @route   GET /api/waste/mrs
// @desc    Get user's Material Recovery Score and calculation breakdown
// @access  Private
router.get("/mrs", protect, async (req, res) => {
  try {
    const records = await WasteRecord.find({ user: req.user._id });

    let totalKg = 0;
    let totalWeightedRecovery = 0;
    const breakdown = {
      plastic: { kg: 0, weight: MRS_WEIGHTS.plastic },
      paper: { kg: 0, weight: MRS_WEIGHTS.paper },
      metal: { kg: 0, weight: MRS_WEIGHTS.metal },
      glass: { kg: 0, weight: MRS_WEIGHTS.glass },
      cardboard: { kg: 0, weight: MRS_WEIGHTS.cardboard },
      other: { kg: 0, weight: MRS_WEIGHTS.other }
    };

    records.forEach((rec) => {
      const cat = rec.wasteCategory;
      if (breakdown[cat]) {
        breakdown[cat].kg = Number((breakdown[cat].kg + rec.quantity).toFixed(2));
      }
      totalKg += rec.quantity;
      totalWeightedRecovery += rec.quantity * (MRS_WEIGHTS[cat] || 0.4);
    });

    const score = totalKg > 0 ? Math.round((totalWeightedRecovery / totalKg) * 100) : 0;

    res.json({
      success: true,
      score,
      totalKg: Number(totalKg.toFixed(2)),
      breakdown,
      formulaExplanation:
        "MRS = (Sum of [Category Quantity × Category Recyclability Factor] ÷ Total Disposed Quantity) × 100. This is a transparent index representing segregation efficiency based solely on stored user records.",
      weights: MRS_WEIGHTS
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to calculate MRS", error: error.message });
  }
});

// @route   GET /api/waste/points-history
// @desc    Get points transactions history
// @access  Private
router.get("/points-history", protect, async (req, res) => {
  try {
    const transactions = await EcoPointTransaction.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      transactions,
      currentBalance: req.user.ecoPoints
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch points history", error: error.message });
  }
});

module.exports = router;
