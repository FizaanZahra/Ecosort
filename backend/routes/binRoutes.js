const express = require("express");
const Bin = require("../models/Bin");
const Notification = require("../models/Notification");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

const DEFAULT_BINS = [
  {
    binId: "BIN-001",
    name: "Main Block",
    location: "Campus Main Academic Block - Ground Floor",
    acceptedCategory: "All",
    capacityKg: 50,
    currentFillKg: 17.5,
    simulatedFillPercentage: 35,
    status: "Available"
  },
  {
    binId: "BIN-002",
    name: "Library",
    location: "Central Library Entrance",
    acceptedCategory: "Paper",
    capacityKg: 50,
    currentFillKg: 39,
    simulatedFillPercentage: 78,
    status: "Almost Full"
  },
  {
    binId: "BIN-003",
    name: "Cafeteria",
    location: "Main Dining Hall Exit",
    acceptedCategory: "Plastic",
    capacityKg: 60,
    currentFillKg: 57,
    simulatedFillPercentage: 95,
    status: "Full"
  },
  {
    binId: "BIN-004",
    name: "Student Center",
    location: "Student Activity Center Plaza",
    acceptedCategory: "Mixed",
    capacityKg: 40,
    currentFillKg: 8,
    simulatedFillPercentage: 20,
    status: "Available"
  }
];

// Helper to seed bins if none exist
const seedBinsIfEmpty = async () => {
  const count = await Bin.countDocuments();
  if (count === 0) {
    await Bin.insertMany(DEFAULT_BINS);
    console.log("Seeded default simulated EcoSort bins");
  }
};

// @route   GET /api/bins
// @desc    Get all bins with simulated fill levels
// @access  Public
router.get("/", async (req, res) => {
  try {
    await seedBinsIfEmpty();
    const bins = await Bin.find().sort({ binId: 1 });
    res.json({
      success: true,
      bins,
      note: "Bin fill levels are simulated for demonstration purposes without requiring physical IoT sensors."
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bins", error: error.message });
  }
});

// @route   GET /api/bins/:id
// @desc    Get a specific bin
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const bin = await Bin.findById(req.params.id);
    if (!bin) {
      return res.status(404).json({ message: "Bin not found" });
    }
    res.json({ success: true, bin });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bin", error: error.message });
  }
});

// @route   PATCH /api/bins/:id/simulate
// @desc    Update simulated fill level (Admin only)
// @access  Private/Admin
router.patch("/:id/simulate", protect, adminOnly, async (req, res) => {
  try {
    const { simulatedFillPercentage } = req.body;

    const fill = parseInt(simulatedFillPercentage);
    if (isNaN(fill) || fill < 0 || fill > 100) {
      return res.status(400).json({ message: "Simulated fill percentage must be a number between 0 and 100." });
    }

    const bin = await Bin.findById(req.params.id);
    if (!bin) {
      return res.status(404).json({ message: "Bin not found" });
    }

    bin.simulatedFillPercentage = fill;
    bin.currentFillKg = Number(((fill / 100) * bin.capacityKg).toFixed(1));
    bin.updateStatusFromFill();
    bin.lastUpdated = new Date();
    await bin.save();

    if (bin.simulatedFillPercentage >= 90) {
      await Notification.create({
        user: null,
        title: `Alert: ${bin.name} Bin is ${bin.simulatedFillPercentage}% Full`,
        message: `Fill level telemetry indicates ${bin.name} bin requires collection immediately.`,
        type: "BIN_ALERT"
      });
    }

    res.json({
      success: true,
      message: `Fill level updated for ${bin.name} to ${fill}% (${bin.status})`,
      bin
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update bin fill level", error: error.message });
  }
});

// @route   POST /api/bins
// @desc    Create a new bin (Admin only)
// @access  Private/Admin
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { binId, name, location, acceptedCategory, capacityKg, simulatedFillPercentage } = req.body;

    if (!binId || !name || !location) {
      return res.status(400).json({ message: "binId, name, and location are required." });
    }

    const existing = await Bin.findOne({ binId: binId.trim().toUpperCase() });
    if (existing) {
      return res.status(400).json({ message: "A bin with this Bin ID already exists." });
    }

    const initialFill = simulatedFillPercentage ? Math.min(100, Math.max(0, parseInt(simulatedFillPercentage))) : 0;
    const capacity = capacityKg ? parseFloat(capacityKg) : 50;

    const bin = new Bin({
      binId: binId.trim().toUpperCase(),
      name: name.trim(),
      location: location.trim(),
      acceptedCategory: acceptedCategory || "All",
      capacityKg: capacity,
      currentFillKg: Number(((initialFill / 100) * capacity).toFixed(1)),
      simulatedFillPercentage: initialFill
    });

    bin.updateStatusFromFill();
    await bin.save();

    res.status(201).json({ success: true, message: "Bin created successfully", bin });
  } catch (error) {
    res.status(500).json({ message: "Failed to create bin", error: error.message });
  }
});

// @route   DELETE /api/bins/:id
// @desc    Delete a bin (Admin only)
// @access  Private/Admin
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const bin = await Bin.findByIdAndDelete(req.params.id);
    if (!bin) {
      return res.status(404).json({ message: "Bin not found" });
    }
    res.json({ success: true, message: `Bin ${bin.name} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete bin", error: error.message });
  }
});

module.exports = router;
