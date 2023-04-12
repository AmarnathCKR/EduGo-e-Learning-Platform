const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");
const { Instructor } = require("../../database/Instructor");
const { Course } = require("../../database/Course");
const { Admin } = require("../../database/Admin");
const { FieldCategory } = require("../../database/FieldCategory");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT, { expiresIn: "1d" });
};

exports.createFields = async (req, res) => {
  const { name, tag, image } = req.body;
  console.log(req.body);
  if (req.body) {
    new FieldCategory({
      name: name,
      tag: tag,
      image: image,
    })
      .save()
      .then((result) => {
        const success = {
          status: true,
          content: {
            data: result,
          },
        };
        res.status(200).send({ data: success });
      });
  } else {
    const emailError = {
      status: false,
      errors: [
        {
          param: "no inputs",
          message: "No data received",
          code: "INVALID_INPUTS",
        },
      ],
    };
    res.status(409).send({ data: emailError });
  }
};

exports.fetchAllFields = async (req, res) => {
  
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const sortField = req.query.sortField || "name";
  const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
  const searchText = req.query.searchText || "";

  const skip = (page - 1) * pageSize;

  const filter = {
    $or: [{ name: { $regex: searchText, $options: "i" } }],
  };

  const totalCount = await FieldCategory.countDocuments(filter);

  const data = await FieldCategory.find(filter)
    .sort({ [sortField]: sortOrder })
    .skip(skip)
    .limit(pageSize)
    .exec();
  const result = data.map((item) => {
    return { id: item._id, image: item.image, name: item.name, tag: item.tag };
  });

  res.json({
    items: result,
    totalCount: totalCount,
  });
};
