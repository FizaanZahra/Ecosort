const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: ["Coupons", "Merchandise", "Certificates", "Sustainability"],
      default: "Coupons"
    },
    pointsCost: {
      type: Number,
      required: true,
      min: 1
    },
    icon: {
      type: String,
      default: "🎁"
    },
    voucherTemplate: {
      type: String,
      default: "ECO-REWARD-"
    },
    stock: {
      type: Number,
      default: 50
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Reward", rewardSchema);
