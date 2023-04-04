const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const CourseSchema = new mongoose.Schema(
  {
    name: String,
    headline: String,
    description: String,
    image: String,
    status: String,
    field: String,
    price: String,
    experience: String,
    total: String,
    topics: [],
    instructor : mongoose.Types.ObjectId
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", CourseSchema);

module.exports = { Course };
