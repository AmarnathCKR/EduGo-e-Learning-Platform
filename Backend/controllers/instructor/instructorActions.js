const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const request = require("request");


const nodemailer = require("nodemailer");
const { Instructor } = require("../../database/Instructor");
const { Course } = require("../../database/Course");
const Order = require("../../database/Order");

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
    video,
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
      video: video,
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

exports.fetchInstructor = async (req, res) => {
  const { id } = req.params;
  const inData = await Instructor.findOne({ _id: id });
  const success = {
    status: true,
    content: {
      data: inData,
    },
  };
  res.status(200).send({ data: success });
};

exports.searchCourse = async (req, res) => {
  const { id, search } = req.query;
  if (search) {
    const data = await Course.find({
      instructor: id,
      $or: [{ name: { $regex: search, $options: "i" } }],
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

exports.findCourseByID = async (req, res) => {
  const { course } = req.query;
  if (course) {
    const data = await Course.findOne({ _id: course }).populate("field");
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

exports.ediInstructorCourse = async (req, res) => {
  
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
    video,
    courseId,
  } = req.body;

  await Instructor.findOne({ _id: id }).then(async (user) => {
    await Course.findByIdAndUpdate(courseId, {
      name: name,
      headline: headline,
      description: description,
      image: image,

      field: field,
      price: price,
      experience: experience,
      total: total,
      topics: topics,
      video: video,
    })

    const courseData = await Course.findOne({
      _id: courseId,
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


exports.generateOTP = async (req, res) => {
  const auth =process.env.VIDEO_API;

  const { videoId } = req.query;
  var options = {
    method: "POST",
    url: `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Apisecret ${auth}`,
    },
    body: { ttl: 300 },
    json: true,
  };
  let result;

  await request(options, function (error, response, body) {
    
    
    result =  response
    
  });

  res.json({result})
}

exports.setPayment = async (req,res)=>{
  const { id} = req.params;
  const data = await Instructor.findByIdAndUpdate({_id : id},{payment : req.body});

  if(data){
    res.status(200).json({data})
  }
  
}

exports.getAllPayments = async (req,res) => {
  const {courseId} =req.query;
  
  const orders = await Order .find({courseId : courseId}).populate("user")
  
  res.status(200).json({orders})
}