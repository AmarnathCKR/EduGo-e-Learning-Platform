const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const InstructorSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    image: {
      type: String,
    },
    headline: String,
    description: String,
    country: String,
    region: String,
    git:String,
    linkedin: String,
    facebook: String,
    twitter: String,
    password: String,
    google: Boolean,
    status : Boolean,
    payment : {}
  },
  { timestamps: true }
);

const Instructor = mongoose.model("Instructor", InstructorSchema);

module.exports = { Instructor };
