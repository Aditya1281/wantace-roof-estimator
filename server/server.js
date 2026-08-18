const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const configRoutes = require("./routes/configRoutes");
const estimateRoutes = require("./routes/estimateRoutes");
const leadRoutes = require("./routes/leadRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Wantace Roofing Estimator API is running",
  });
});

app.use("/api/config", configRoutes);
app.use("/api/estimate", estimateRoutes);
app.use("/api/leads", leadRoutes);

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
}

startServer();