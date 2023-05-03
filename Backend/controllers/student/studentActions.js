const { Course } = require("../../database/Course");
const { Student } = require("../../database/Student");
const { FieldCategory } = require("../../database/FieldCategory");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const admin = require("firebase-admin");
const Multer = require('multer');


var serviceAccount = require("../../database/edugo-e-lerning-firebase-adminsdk-byo2p-024b7d9521.json");
const Coupon = require("../../database/Coupon");
const Order = require("../../database/Order");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),

  storageBucket: "edugo-e-lerning.appspot.com"
});

const bucket = admin.storage().bucket();


// Set up multer for file uploads
const upload = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // maximum file size of 5MB
  },
});

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT, { expiresIn: "1d" });
};

exports.studentSearch = async (req, res) => {

  if (req.query.search) {
    const { search } = req.query;
    console.log("searched" + search)
    const escapedQuery = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchObject = search
      ? { name: { $regex: new RegExp(escapedQuery, 'i') } }
      : {};

    const data = await Course.find({ ...searchObject }).sort({ datefield: -1 });

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
  const allCourse = await Course.find({ status: "active" });
  const success = {
    status: true,
    content: {
      data: allCourse,
    },
  };
  res.status(200).send({ data: success });
};

exports.fetchStudent = async (req, res) => {
  const { id } = req.params;
  const studentData = await Student.findOne({ _id: id });
  const success = {
    status: true,
    content: {
      data: studentData,
    },
  };
  res.status(200).send({ data: success });
}

exports.fetchAllFields = async (req, res) => {
  FieldCategory.find().then((result) => {
    const success = {
      status: true,
      content: {
        data: result,
      },
    };
    res.status(200).send({ data: success });
  })
}

exports.findStudentCourseByID = async (req, res) => {
  const { course } = req.query;
  if (course) {
    const data = await Course.findOne({ _id: course }).populate("field").populate("instructor");
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




exports.streamVideo = async (req, res) => {
  const videoId = req.query.videoId;

  try {
    // Get a reference to the video file in Firebase Storage
    const videoRef = bucket.file(`videos/${videoId}`);

    // Download the video file to a local file
    const [url, videoSize] = await Promise.all([
      videoRef.getSignedUrl({
        action: "read",
        expires: "03-17-2024", // expiration date of the signed URL
      }),
      videoRef.getMetadata().then((metadata) => metadata.size),
    ]);

    // Set the response headers to allow for range requests
    res.setHeader("Accept-Ranges", "bytes");
    const range = req.headers.range;

    if (!range) {
      // Send the full video if no range header is provided
      res.status(200).send(url);
      return;
    }

    // Parse the range header
    const start = Number(range.replace(/bytes=/, "").split("-")[0]);
    const end = Number(range.replace(/bytes=/, "").split("-")[1]) || videoSize - 1;
    const chunkSize = (end - start) + 1;

    // Create a readable stream from the video file
    const stream = videoRef.createReadStream({ start, end });

    // Set the response headers for the chunk
    res.status(206).set({
      "Content-Type": "video/mp4",
      "Content-Length": chunkSize,
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    });

    // Send the video chunk
    stream.pipe(res);

    // Revoke the signed URL to prevent memory leaks
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  } catch (error) {
    res.status(404).send("Video not found");
    console.error(error);
  }
};


exports.searchCoupon = async (req, res) => {
  const { search, id } = req.query;
  if (search) {

    const data = await Coupon.findOne({ name: search, status: true });
    if (data) {
      const valid = await Student.findOne({ _id: id, coupons: data._id })
      if (valid) {
        const emailError = {
          status: false,
          errors: [
            {
              param: "Input error",
              message: "Coupon Already Used",
              code: "INVALID",
            },
          ],
        };
        res.status(409).send({ data: emailError });

      } else {
        let currentDate = Date.now();

        function formatDate(date) {
          let d = new Date(date),
            month = "" + (d.getMonth() + 1),
            day = "" + d.getDate(),
            year = d.getFullYear();

          if (month.length < 2) month = "0" + month;
          if (day.length < 2) day = "0" + day;

          return [year, month, day].join("-");
        }

        let formatedDate = formatDate(currentDate);

        if (data.expirationTime > formatedDate) {
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
                message: "Coupon Expired",
                code: "INPUT_ERROR",
              },
            ],
          };
          res.status(409).send({ data: emailError });
        }

      }

    } else {
      const emailError = {
        status: false,
        errors: [
          {
            param: "Input error",
            message: "No Coupon found",
            code: "INPUT_ERROR",
          },
        ],
      };
      res.status(409).send({ data: emailError });

    }

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
}


exports.purchase = async (req, res) => {
  const {
    orderId,
    courseId,
    coupon,
    amount,
    final,
    discount
  } = req.body;
  console.log(req.body)

  const { id } = req.query;
  let newOrder = new Order({
    orderId: orderId,
    courseId: courseId,
    coupon: coupon,
    amount: amount,
    final: final,
    discount: discount,
    user: id
  })

  if (orderId) {
    if (coupon === "nil") {
       newOrder = new Order({
        orderId: orderId,
        courseId: courseId,

        amount: amount,
        final: final,
        discount: discount,
        user: id
      })
    }

    newOrder.save().then((result) => {
      const success = {
        status: true,
        content: {
          data: result,
        },
      };
      res.status(200).send({ data: success });
    }).catch((err) => {
      const emailError = {
        status: false,
        errors: [
          {
            param: "Input error",
            message: err,
            code: "INPUT_ERROR",
          },
        ],
      };
      res.status(409).send({ data: emailError });
    })

  }
}

exports.getOrder = async (req, res) => {
  const { search } = req.query;
  if (search) {
    const order = await Order.findOne({ _id: search });
    if (order) {
      const success = {
        status: true,
        content: {
          data: order,
        },
      };
      res.status(200).send({ data: success });
    }
  }
}

exports.getStatus = async (req,res) =>{
  const { id,course } = req.query;
  const status = await Order.findOne({user : id, courseId : course}) 
  if(status){
    const success = {
      status: true,
      content: {
        data: "status",
      },
    };
    res.status(200).send({ data: success });
  }else{
    const emailError = {
      status: false,
      errors: [
        {
          param: "Input error",
          message: "No course",
          code: "INPUT_ERROR",
        },
      ],
    };
    res.status(409).send({ data: emailError });
  }
}