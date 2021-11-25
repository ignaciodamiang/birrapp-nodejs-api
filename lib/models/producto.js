"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productoSchema = new Schema(
  {
    description: {
      type: String,
    },
    name: {
      type: String,
    },
    price: Number,
    type: {
      type: String,
      enum: ["cervezas", "vinos", "sin-alcohol", "destilados", "snacks"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productoSchema);
