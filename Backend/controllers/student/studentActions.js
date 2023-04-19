const { Course } = require("../../database/Course");
const { Student } = require("../../database/Student");
const { FieldCategory } = require("../../database/FieldCategory");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const bcrypt = require("bcrypt");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT, { expiresIn: "1d" });
};

exports.studentSearch = async (req, res) => {
  if (req.query.search) {
    const { search } = req.query;
    console.log(search);
    const data = await Course.find({
      $or: [{ name: { $regex: search, $options: "i" }  }],
    }).sort({ datefield: -1 });

    const success = {
      status: true,
      content: {
        data: data,
      },
    };
    res.status(200).send({ data: success });
  } else {
    const emailError = {
      status: false,
      errors: [
        {
          param: "Input error",
          message: "No input received",
          code: "INPUT_ERROR",
        },
      ],
    };
    res.status(409).send({ data: emailError });
  }
};

exports.updateStudentProfile = async (req, res) => {
  console.log(req.body);
  const { id } = req.params;
  const {
    name,
    headline,
    description,
    country,
    region,
    git,
    linkedin,
    facebook,
    twitter,
    image,
  } = req.body;

  Student.findOne({ _id: id }).then(async (user) => {
    await Student.findOneAndUpdate(
      { _id: user._id },
      {
        name: name,
        headline: headline,
        description: description,
        country: country,
        region: region,
        git: git,
        linkedin: linkedin,
        facebook: facebook,
        twitter: twitter,
        image: image,
      }
    )
      .then((users) => {
        const success = {
          status: true,
          content: {
            data: {
              id: users._id,
              name: name,
              email: users.email,
              headline: headline,
              description: description,
              country: country,
              region: region,
              git: git,
              linkedin: linkedin,
              facebook: facebook,
              twitter: twitter,
              image: image,
              created_at: users.createdAt,
            },
          },
        };
        res.status(200).send({ data: success });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.fetchAllCourse = async (req, res) => {
  const allCourse = await Course.find({status : "active"});
  const success = {
    status: true,
    content: {
      data: allCourse,
    },
  };
  res.status(200).send({ data: success });
};

exports.fetchStudent = async (req,res) =>{
  const {id} = req.params;
  const studentData = await Student.findOne({_id : id});
  const success = {
    status: true,
    content: {
      data: studentData,
    },
  };
  res.status(200).send({ data: success });
}

exports.fetchAllFields = async (req,res)=>{
  FieldCategory.find().then((result)=>{
    const success = {
      status: true,
      content: {
        data: result,
      },
    };
    res.status(200).send({ data: success });
  })
}