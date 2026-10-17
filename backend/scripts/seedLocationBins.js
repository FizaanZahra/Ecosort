const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" });
const Bin = require("../models/Bin");

const SEED_BINS = [
  // Kodakara Village (Primary location requested)
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

async function seedLocationBins() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB for location bin seeding.");

  for (const binData of SEED_BINS) {
    await Bin.findOneAndUpdate(
      { binId: binData.binId },
      { $set: binData },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  // Update any existing bins without city/area
  await Bin.updateMany(
    { $or: [{ city: { $exists: false } }, { city: null }, { city: "" }] },
    { $set: { city: "Kodakara", area: "Kodakara Junction" } }
  );

  const count = await Bin.countDocuments();
  console.log(`Successfully seeded location-based bins. Total bins in database: ${count}`);
  await mongoose.disconnect();
}

seedLocationBins().catch(console.error);
