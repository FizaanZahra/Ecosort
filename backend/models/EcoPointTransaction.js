const mongoose = require("mongoose");

const ecoPointTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    transactionType: {
      type: String,
      required: true,
      enum: ["DISPOSAL_REWARD", "REWARD_REDEEM", "BONUS"],
      default: "DISPOSAL_REWARD"
    },
    pointsAmount: {
      type: Number,
      required: true
    },
    wasteRecord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WasteRecord",
      default: null
    },
    description: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("EcoPointTransaction", ecoPointTransactionSchema);
