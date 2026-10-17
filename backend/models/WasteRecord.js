const mongoose = require("mongoose");

const wasteRecordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    wasteCategory: {
      type: String,
      required: true,
      enum: ["plastic", "paper", "metal", "glass", "cardboard", "other"],
      lowercase: true,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [0.01, "Quantity must be at least 0.01 kg"]
    },
    unit: {
      type: String,
      default: "kg"
    },
    bin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bin",
      default: null
    },
    binName: {
      type: String,
      default: "EcoSort General Bin"
    },
    pointsEarned: {
      type: Number,
      default: 0
    },
    materialRecoveryScore: {
      type: Number,
      default: 0
    },
    description: {
      type: String,
      trim: true,
      default: ""
    },
    disposalDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("WasteRecord", wasteRecordSchema);
