const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");
const { Instructor } = require("../../database/Instructor");
const { Course } = require("../../database/Course");


exports.updateProfile = async (req, res) => {
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

  Instructor.findOne({ _id: id }).then(async (user) => {
    await Instructor.findOneAndUpdate(
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

exports.updateInstructorCourse = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    headline,
    description,
    image,
    field,
    topics,
    total,
    experience,
    price,
    video
  } = req.body;

  Instructor.findOne({ _id: id }).then(async (user) => {
    Course({
      name: name,
      headline: headline,
      description: description,
      image: image,
      status: "pending",
      field: field,
      price: price,
      experience: experience,
      total: total,
      topics: topics,
      video : video,
      instructor: user._id,
    }).save();

    const courseData = await Course.find({
      instructor: user._id,
    });

    const success = {
      status: true,
      content: {
        data: courseData,
      },
    };
    res.status(200).send({ data: success });
  });
};

exports.fetchInstructorCourse = async (req, res) => {
  const { id } = req.params;

  const AllCourse = await Course.find({ instructor: id });
  const success = {
    status: true,
    content: {
      data: AllCourse,
    },
  };
  res.status(200).send({ data: success });
};

exports.fetchInstructor = async (req,res) =>{
  const {id} = req.params;
  const inData = await Instructor.findOne({_id : id});
  const success = {
    status: true,
    content: {
      data: inData,
    },
  };
  res.status(200).send({ data: success });
}