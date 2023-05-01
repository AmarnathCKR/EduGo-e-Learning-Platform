const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const StudentSchema = new mongoose.Schema(
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
    git: String,
    linkedin: String,
    facebook: String,
    twitter: String,
    password: String,
    google: Boolean,
    status: Boolean,
    coupons: [{

      type: mongoose.Types.ObjectId,
      ref: 'Coupon'


    }],
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", StudentSchema);

module.exports = { Student };
