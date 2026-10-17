const mongoose = require("mongoose");

const redemptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    reward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reward",
      required: true
    },
    rewardTitle: {
      type: String,
      required: true
    },
    category: {
      type: String,
      default: "Coupons"
    },
    pointsSpent: {
      type: Number,
      required: true
    },
    voucherCode: {
      type: String,
      required: true,
      unique: true
    },
    status: {
      type: String,
      enum: ["Active", "Claimed"],
      default: "Active"
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days validity
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Redemption", redemptionSchema);
