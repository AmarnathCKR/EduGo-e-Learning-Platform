const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const FieldCategorySchema = new mongoose.Schema(
  {
    name: { type: String },
    tag: { type: String },
    image : String,
    
  },
  { timestamps: true }
);

const FieldCategory = mongoose.model("FieldCategory", FieldCategorySchema);

module.exports = { FieldCategory };
