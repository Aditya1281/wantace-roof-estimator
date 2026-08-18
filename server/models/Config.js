const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    rate_per_sqft: Number,
    multiplier: Number,
    tear_off_per_sqft: Number,
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    unit: String,
    required: Boolean,
    min: Number,
    max: Number,
    active: Boolean,
    options: [optionSchema],
  },
  { _id: false }
);

const configSchema = new mongoose.Schema(
  {
    config_version: {
      type: Number,
      required: true,
    },

    business: {
      name: String,
      region: String,
      currency: String,
    },

    questions: [questionSchema],

    modifiers: {
      waste_factor: Number,
      permit_flat_fee: Number,
      range_spread_pct: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Config", configSchema);