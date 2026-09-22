require("dotenv").config(); 
const express = require("express"); 
const cors = require("cors"); 
const connectDB = require("./config/db"); 
const userRoutes = require("./routes/userRoutes"); 
const app = express(); 
const PORT = process.env.PORT || 5000; 
connectDB(); app.use(cors()); 
app.use(express.json()); 
app.use("/api/users", userRoutes); 
app.get("/", (req, res) => { res.json({ message: "EcoSort Backend is running!" }); }); 
app.get("/api/test", (req, res) =>
     { res.json({ success: true, message: "EcoSort API is working!" }); });
 app.listen(PORT, () => 
    { console.log(`EcoSort backend running on http://localhost:${PORT}`); });