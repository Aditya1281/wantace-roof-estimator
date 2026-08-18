const express = require("express");
const Config = require("../models/Config");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Estimate API working",
  });
});

router.post("/", async (req, res) => {
  try {
    const {
      roof_area,
      material,
      pitch,
      layers,
      stories,
    } = req.body;

    // Basic validation
    if (!roof_area || !material || !pitch || !layers || !stories) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const area = Number(roof_area);

    if (Number.isNaN(area) || area <= 0) {
      return res.status(400).json({
        message: "Roof area must be a valid number",
      });
    }

    // Get latest configuration
    const config = await Config.findOne().sort({
      config_version: -1,
    });

    if (!config) {
      return res.status(404).json({
        message: "Configuration not found",
      });
    }

    // Find questions
    const materialQuestion = config.questions.find(
      (q) => q.key === "material"
    );

    const pitchQuestion = config.questions.find(
      (q) => q.key === "pitch"
    );

    const layersQuestion = config.questions.find(
      (q) => q.key === "layers"
    );

    const storiesQuestion = config.questions.find(
      (q) => q.key === "stories"
    );

    // Find selected options
    const materialOption = materialQuestion.options.find(
      (option) => option.value === material
    );

    const pitchOption = pitchQuestion.options.find(
      (option) => option.value === pitch
    );

    const layersOption = layersQuestion.options.find(
      (option) => option.value === layers
    );

    const storiesOption = storiesQuestion.options.find(
      (option) => option.value === stories
    );

    if (
      !materialOption ||
      !pitchOption ||
      !layersOption ||
      !storiesOption
    ) {
      return res.status(400).json({
        message: "Invalid option selected",
      });
    }

    // -----------------------------
    // ROOFING CALCULATION
    // -----------------------------

    const wasteFactor = config.modifiers.waste_factor || 0;

    const adjustedArea = area * (1 + wasteFactor);

    // Material cost
    const materialCost =
      adjustedArea * materialOption.rate_per_sqft;

    // Tear-off cost
    const tearOffCost =
      area * (layersOption.tear_off_per_sqft || 0);

    // Apply pitch and stories multipliers
    const multiplier =
      (pitchOption.multiplier || 1) *
      (storiesOption.multiplier || 1);

    const laborAdjustedCost =
      (materialCost + tearOffCost) * multiplier;

    // Permit
    const permitFee =
      config.modifiers.permit_flat_fee || 0;

    // Final estimate
    const subtotal =
      laborAdjustedCost + permitFee;

    const spread =
      config.modifiers.range_spread_pct || 0;

    const minimum =
      subtotal * (1 - spread / 100);

    const maximum =
      subtotal * (1 + spread / 100);

    res.json({
      success: true,

      estimate: {
        low: Math.round(minimum),
        high: Math.round(maximum),
        midpoint: Math.round(subtotal),
        currency: config.business.currency,
      },

      breakdown: {
        roof_area: area,
        adjusted_area: Math.round(adjustedArea),
        material_cost: Math.round(materialCost),
        tear_off_cost: Math.round(tearOffCost),
        multiplier: Number(multiplier.toFixed(2)),
        permit_fee: permitFee,
      },

      selections: {
        material: materialOption.label,
        pitch: pitchOption.label,
        layers: layersOption.label,
        stories: storiesOption.label,
      },
    });
  } catch (error) {
    console.error("Estimate calculation failed:", error.message);

    res.status(500).json({
      message: "Failed to calculate estimate",
      error: error.message,
    });
  }
});

module.exports = router;