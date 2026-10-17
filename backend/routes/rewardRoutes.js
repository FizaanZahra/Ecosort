const express = require("express");
const crypto = require("crypto");
const Reward = require("../models/Reward");
const Redemption = require("../models/Redemption");
const User = require("../models/User");
const EcoPointTransaction = require("../models/EcoPointTransaction");
const Notification = require("../models/Notification");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const DEFAULT_REWARDS = [
  {
    title: "Campus Cafeteria 25% Off Meal Voucher",
    description: "Get 25% discount on any meal or beverage at the main campus dining hall.",
    category: "Coupons",
    pointsCost: 75,
    icon: "🍽️",
    voucherTemplate: "CAMPUS-MEAL-",
    stock: 100
  },
  {
    title: "Campus Coffee / Beverage Coupon",
    description: "One complimentary hot or iced coffee/tea at the Central Library Cafe.",
    category: "Coupons",
    pointsCost: 50,
    icon: "☕",
    voucherTemplate: "CAFE-FREE-",
    stock: 150
  },
  {
    title: "EcoSort Reusable Bamboo Coffee Tumbler",
    description: "High-grade 450ml thermal stainless tumbler with sustainable bamboo outer sleeve.",
    category: "Merchandise",
    pointsCost: 200,
    icon: "🥤",
    voucherTemplate: "ECO-TUMBLER-",
    stock: 30
  },
  {
    title: "EcoSort Organic Cotton Tote Bag",
    description: "Durable 100% GOTS-certified fair-trade organic cotton shopping and campus tote.",
    category: "Merchandise",
    pointsCost: 100,
    icon: "🛍️",
    voucherTemplate: "ECO-TOTE-",
    stock: 50
  },
  {
    title: "Certified Campus Sustainability Champion Certificate",
    description: "Official institutional e-certificate validating your responsible waste management contribution.",
    category: "Certificates",
    pointsCost: 150,
    icon: "📜",
    voucherTemplate: "ECO-CERT-",
    stock: 500
  },
  {
    title: "Tree Planting Initiative Pledge",
    description: "We partner with local forestry to plant a native tree sapling on campus in your name.",
    category: "Sustainability",
    pointsCost: 250,
    icon: "🌳",
    voucherTemplate: "TREE-PLANT-",
    stock: 80
  }
];

// Seed default rewards if collection is empty
const seedRewardsIfEmpty = async () => {
  const count = await Reward.countDocuments();
  if (count === 0) {
    await Reward.insertMany(DEFAULT_REWARDS);
    console.log("Seeded initial EcoSort rewards");
  }
};

// @route   GET /api/rewards
// @desc    Get all available rewards in store
// @access  Public
router.get("/", async (req, res) => {
  try {
    await seedRewardsIfEmpty();
    const rewards = await Reward.find().sort({ pointsCost: 1 });
    res.json({
      success: true,
      rewards
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch rewards", error: error.message });
  }
});

// @route   POST /api/rewards/:id/redeem
// @desc    Redeem a reward with user's EcoPoints
// @access  Private
router.post("/:id/redeem", protect, async (req, res) => {
  try {
    const reward = await Reward.findById(req.params.id);
    if (!reward) {
      return res.status(404).json({ message: "Reward not found" });
    }

    if (reward.stock <= 0) {
      return res.status(400).json({ message: "Sorry, this reward is currently out of stock." });
    }

    // Refresh user's balance
    const user = await User.findById(req.user._id);
    if (user.ecoPoints < reward.pointsCost) {
      return res.status(400).json({
        message: `Insufficient EcoPoints. You have ${user.ecoPoints} points, but this reward costs ${reward.pointsCost} points.`
      });
    }

    // Generate unique voucher code
    const randomSuffix = crypto.randomBytes(3).toString("hex").toUpperCase();
    const voucherCode = `${reward.voucherTemplate || "ECO-"}${randomSuffix}`;

    // 1. Deduct points atomically
    user.ecoPoints -= reward.pointsCost;
    await user.save();

    // 2. Decrement stock
    reward.stock = Math.max(0, reward.stock - 1);
    await reward.save();

    // 3. Create redemption voucher
    const redemption = await Redemption.create({
      user: user._id,
      reward: reward._id,
      rewardTitle: reward.title,
      category: reward.category,
      pointsSpent: reward.pointsCost,
      voucherCode,
      status: "Active"
    });

    // 4. Log transaction
    await EcoPointTransaction.create({
      user: user._id,
      transactionType: "REWARD_REDEEM",
      pointsAmount: -reward.pointsCost,
      description: `Redeemed voucher for "${reward.title}" (Code: ${voucherCode})`
    });

    // 5. Create notification
    await Notification.create({
      user: user._id,
      title: "Reward Redeemed!",
      message: `You successfully redeemed ${reward.title}. Voucher code: ${voucherCode}`,
      type: "POINTS"
    });

    res.status(201).json({
      success: true,
      message: `Successfully redeemed "${reward.title}"!`,
      redemption,
      newPointsBalance: user.ecoPoints
    });
  } catch (error) {
    res.status(500).json({ message: "Redemption failed", error: error.message });
  }
});

// @route   GET /api/rewards/my-redemptions
// @desc    Get user's redeemed rewards & active vouchers
// @access  Private
router.get("/my-redemptions", protect, async (req, res) => {
  try {
    const redemptions = await Redemption.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("reward", "icon title description category");

    res.json({
      success: true,
      redemptions
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch redemptions", error: error.message });
  }
});

module.exports = router;
