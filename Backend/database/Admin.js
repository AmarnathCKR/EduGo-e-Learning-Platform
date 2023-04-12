const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const AdminSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    password : String,
    
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = { Admin };
