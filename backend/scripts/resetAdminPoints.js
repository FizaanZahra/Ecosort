const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" });
const User = require("../models/User");
const EcoPointTransaction = require("../models/EcoPointTransaction");

async function resetAdminPoints() {
  await mongoose.connect(process.env.MONGO_URI);
  const result = await User.updateOne(
    { email: "admin@ecosort.com" },
    { $set: { ecoPoints: 0 } }
  );
  const admin = await User.findOne({ email: "admin@ecosort.com" });
  if (admin) {
    await EcoPointTransaction.deleteMany({ user: admin._id });
  }
  console.log("Successfully reset admin points:", result, "New admin points:", admin ? 0 : "not found");
  await mongoose.disconnect();
}

resetAdminPoints().catch(console.error);
