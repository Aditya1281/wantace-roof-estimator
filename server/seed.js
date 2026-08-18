const express = require("express");
const Config = require("../models/Config");

const router = express.Router();

// Get latest roofing configuration
router.get("/", async (req, res) => {
  try {
    const config = await Config.findOne().sort({ config_version: -1 });

    if (!config) {
      return res.status(404).json({
        message: "Configuration not found",
      });
    }

    res.json(config);
  } catch (error) {
    console.error("Config fetch failed:", error.message);

    res.status(500).json({
      message: "Failed to fetch configuration",
      error: error.message,
    });
  }
});

module.exports = router;