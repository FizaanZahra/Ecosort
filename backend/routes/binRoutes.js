const express = require("express");
const Bin = require("../models/Bin");
const Notification = require("../models/Notification");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

const DEFAULT_BINS = [
  // Kodakara Village
  {
    binId: "KDK-001",
    name: "Kodakara Bus Stand Depot",
    city: "Kodakara",
    area: "Kodakara Junction",
    location: "Near KSRTC Waiting Shelter, Main Junction",
    acceptedCategory: "All",
    capacityKg: 60,
    currentFillKg: 18,
    simulatedFillPercentage: 30,
    status: "Available"
  },
  {
    binId: "KDK-002",
    name: "Market Road Plastic Depot",
    city: "Kodakara",
    area: "Market Road",
    location: "Opposite Farmers Vegetable Market Gate",
    acceptedCategory: "Plastic",
    capacityKg: 50,
    currentFillKg: 38,
    simulatedFillPercentage: 76,
    status: "Almost Full"
  },
  {
    binId: "KDK-003",
    name: "Vellikulangara Green Station",
    city: "Kodakara",
    area: "Vellikulangara Road",
    location: "Near Cooperative Bank Commercial Complex",
    acceptedCategory: "Paper",
    capacityKg: 45,
    currentFillKg: 10,
    simulatedFillPercentage: 22,
    status: "Available"
  },
  {
    binId: "KDK-004",
    name: "Panchayat Office Hub",
    city: "Kodakara",
    area: "Panchayat Office Ward",
    location: "Kodakara Grama Panchayat Office Main Entrance",
    acceptedCategory: "All",
    capacityKg: 70,
    currentFillKg: 35,
    simulatedFillPercentage: 50,
    status: "Available"
  },
  {
    binId: "KDK-005",
    name: "Shanthi Nagar Residential Depot",
    city: "Kodakara",
    area: "Shanthi Nagar",
    location: "Shanthi Nagar 2nd Cross Road Corner",
    acceptedCategory: "Mixed",
    capacityKg: 50,
    currentFillKg: 46,
    simulatedFillPercentage: 92,
    status: "Full"
  },

  // Chalakudy Town
  {
    binId: "CKD-101",
    name: "Chalakudy Railway Station Depot",
    city: "Chalakudy",
    area: "Railway Station Road",
    location: "West Entrance Booking Counter Side",
    acceptedCategory: "All",
    capacityKg: 80,
    currentFillKg: 32,
    simulatedFillPercentage: 40,
    status: "Available"
  },
  {
    binId: "CKD-102",
    name: "South Junction Public Receptacle",
    city: "Chalakudy",
    area: "South Junction",
    location: "Near Private Bus Stand Concourse",
    acceptedCategory: "Plastic",
    capacityKg: 50,
    currentFillKg: 15,
    simulatedFillPercentage: 30,
    status: "Available"
  },

  // Irinjalakuda Town
  {
    binId: "IJK-201",
    name: "Koodalmanikyam East Nada Bin",
    city: "Irinjalakuda",
    area: "Temple East Nada",
    location: "East Nada Pilgrims Information Center",
    acceptedCategory: "All",
    capacityKg: 50,
    currentFillKg: 18,
    simulatedFillPercentage: 36,
    status: "Available"
  },
  {
    binId: "IJK-202",
    name: "Town Bus Stand Receptacle",
    city: "Irinjalakuda",
    area: "Town Center",
    location: "Municipal Bus Stand Bay 3",
    acceptedCategory: "Mixed",
    capacityKg: 60,
    currentFillKg: 24,
    simulatedFillPercentage: 40,
    status: "Available"
  },

  // Thrissur City
  {
    binId: "TSR-301",
    name: "Swaraj Round North Receptacle",
    city: "Thrissur",
    area: "Swaraj Round",
    location: "Near Kuruppam Road Junction Point",
    acceptedCategory: "All",
    capacityKg: 80,
    currentFillKg: 45,
    simulatedFillPercentage: 56,
    status: "Available"
  },
  {
    binId: "TSR-302",
    name: "East Fort Commercial Hub",
    city: "Thrissur",
    area: "East Fort",
    location: "Near Jubilee Mission Hospital Junction",
    acceptedCategory: "Plastic",
    capacityKg: 60,
    currentFillKg: 28,
    simulatedFillPercentage: 46,
    status: "Available"
  }
];

// Helper to seed bins if none exist
const seedBinsIfEmpty = async () => {
  const count = await Bin.countDocuments();
  if (count === 0) {
    await Bin.insertMany(DEFAULT_BINS);
    console.log("Seeded default location-based EcoSort bins");
  }
};

// @route   GET /api/bins/locations
// @desc    Get unique cities/villages and areas for location-based bin filtering
// @access  Public
router.get("/locations", async (req, res) => {
  try {
    await seedBinsIfEmpty();
    const bins = await Bin.find({}, "city area");
    const locationMap = {};

    bins.forEach((b) => {
      const city = b.city || "Kodakara";
      const area = b.area || "Kodakara Junction";
      if (!locationMap[city]) {
        locationMap[city] = new Set();
      }
      locationMap[city].add(area);
    });

    const locations = Object.keys(locationMap).sort().map((city) => ({
      city,
      areas: Array.from(locationMap[city]).sort()
    }));

    res.json({
      success: true,
      locations
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bin locations", error: error.message });
  }
});

// @route   GET /api/bins
// @desc    Get all bins with optional city and area filters
// @access  Public
router.get("/", async (req, res) => {
  try {
    await seedBinsIfEmpty();
    const filter = {};

    if (req.query.city && req.query.city !== "All") {
      filter.city = new RegExp(`^${req.query.city.trim()}$`, "i");
    }
    if (req.query.area && req.query.area !== "All") {
      filter.area = new RegExp(`^${req.query.area.trim()}$`, "i");
    }

    const bins = await Bin.find(filter).sort({ binId: 1 });
    res.json({
      success: true,
      bins
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
// @desc    Update fill level (Admin only)
// @access  Private/Admin
router.patch("/:id/simulate", protect, adminOnly, async (req, res) => {
  try {
    const { simulatedFillPercentage } = req.body;

    const fill = parseInt(simulatedFillPercentage);
    if (isNaN(fill) || fill < 0 || fill > 100) {
      return res.status(400).json({ message: "Fill percentage must be a number between 0 and 100." });
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
        message: `Fill level telemetry indicates ${bin.name} bin in ${bin.area || bin.city} requires collection immediately.`,
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
    const {
      binId,
      name,
      location,
      city,
      area,
      acceptedCategory,
      capacityKg,
      simulatedFillPercentage
    } = req.body;

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
      city: city ? city.trim() : "Kodakara",
      area: area ? area.trim() : "Kodakara Junction",
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
    const bin = await Bin.findById(req.params.id);
    if (!bin) {
      return res.status(404).json({ message: "Bin not found" });
    }

    await Bin.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: `Bin ${bin.binId} deleted successfully.` });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete bin", error: error.message });
  }
});

module.exports = router;
