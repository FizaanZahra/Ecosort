const mongoose = require("mongoose");

const binSchema = new mongoose.Schema(
  {
    binId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      default: "Kodakara",
      trim: true,
      index: true
    },
    area: {
      type: String,
      default: "Kodakara Junction",
      trim: true
    },
    acceptedCategory: {
      type: String,
      enum: ["All", "Plastic", "Paper", "Metal", "Glass", "Cardboard", "Mixed"],
      default: "All"
    },
    capacityKg: {
      type: Number,
      default: 50
    },
    currentFillKg: {
      type: Number,
      default: 0
    },
    simulatedFillPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    status: {
      type: String,
      enum: ["Available", "Almost Full", "Full", "Maintenance"],
      default: "Available"
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Method to automatically update status based on simulated fill percentage
binSchema.methods.updateStatusFromFill = function () {
  if (this.simulatedFillPercentage >= 90) {
    this.status = "Full";
  } else if (this.simulatedFillPercentage >= 70) {
    this.status = "Almost Full";
  } else {
    this.status = "Available";
  }
};

module.exports = mongoose.model("Bin", binSchema);
