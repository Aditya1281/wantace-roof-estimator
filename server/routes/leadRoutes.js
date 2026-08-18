const express = require("express");
const Lead = require("../models/Lead");

const router = express.Router();

// Test route
router.get("/", async (req, res) => {
  try {
    const leads = await Lead.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: leads.length,
      leads,
    });
  } catch (error) {
    console.error("Lead fetch failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch leads",
    });
  }
});

// Create a new lead
router.post("/", async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      estimate,
    } = req.body;

    if (!name || !phone || !email) {
      return res.status(400).json({
        success: false,
        message:
          "Name, phone and email are required",
      });
    }

    const lead = await Lead.create({
      name,
      phone,
      email,
      estimate,
    });

    res.status(201).json({
      success: true,
      message: "Lead saved successfully",
      lead,
    });
  } catch (error) {
    console.error(
      "Lead creation failed:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to save lead",
    });
  }
});

module.exports = router;