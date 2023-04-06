const router = require("express").Router();

const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Snowflake } = require("@theinternetfolks/snowflake");
const { Instructor } = require("../database/Instructor");
const nodemailer = require("nodemailer");
const { Course } = require("../database/Course");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT, { expiresIn: "1d" });
};

router.post("/signup", async (req, res) => {
  const { name, email, image, password, google } = req.body;
  if (google === true) {
    if (email) {
      const user = await Instructor.findOne({ email });
      if (user) {
        const stat = {
          status: false,
          errors: [
            {
              param: "email",
              message: "User Already Exist",
              code: "INVALID_INPUT",
            },
          ],
        };
        res.status(409).send({ data: stat });
      } else {
        const newUser = new Instructor({
          name: name,
          email: email,
          image: image,
          google: true,
        });

        await newUser.save();

        const users = await Instructor.findOne({ email });
        const token = await createToken(users._id);

        const success = {
          status: true,
          content: {
            data: {
              id: users._id,
              name: users.name,
              email: users.email,
              image: users.image,
              created_at: users.createdAt,
            },
            meta: {
              access_token: token,
            },
          },
        };
        res.status(200).send({ data: success });
      }
    } else {
      const stat = {
        status: false,
        errors: [
          {
            param: "googleAuth",
            message: "No data received",
            code: "INVALID_INPUT",
          },
        ],
      };
      res.status(409).send({ data: stat });
    }
  } else {
    if (name.length <= 6) {
      const stat = {
        status: false,
        errors: [
          {
            param: "name",
            message: "Name should be at least 6 characters.",
            code: "INVALID_INPUT",
          },
        ],
      };
      res.status(409).send({ data: stat });
    } else {
      const member = await Instructor.findOne({ email });
      if (member) {
        const exist = {
          status: false,
          errors: [
            {
              param: "name",
              message: "Email already exist",
              code: "INVALID_INPUT",
            },
          ],
        };
        res.status(409).send({ data: exist });
      } else {
        const match = email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
        if (match) {
          if (password.length < 7) {
            const passError = {
              status: false,
              errors: [
                {
                  param: "password",
                  message: "password should be min 6",
                  code: "INVALID_INPUT",
                },
              ],
            };
            res.status(409).send({ data: passError });
          } else {
            const hashPassword = await bcrypt.hash(password, 10);

            req.session.newInstructor = {
              name: name,
              email: email,
              password: hashPassword,
              google: false,
            };

            const otp = Math.floor(Math.random() * 1000000 + 1);

            req.session.authOTP = otp;

            let transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: process.env.NODEMAIL,
                pass: process.env.NODEMAIL_PASSWORD,
              },
            });

            let mailOptions = {
              from: "amarnathchakkiyar@gmail.com",
              to: email,
              subject: "YOUR OTP",

              html: `<h3>Your OTP is here<h3> <br> <p>${otp}</p>`,
            };

            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                const passError = {
                  status: false,
                  errors: [
                    {
                      param: "OTP",
                      message: "Error sending OTP",
                      code: "INVALID_INPUT",
                    },
                  ],
                };
                res.status(409).send({ data: passError });
              } else {
                const success = {
                  status: true,
                  content: {
                    data: { token: otp },
                  },
                };
                res.status(200).send({ data: success });
              }
            });
          }
        } else {
          const emailError = {
            status: false,
            errors: [
              {
                param: "email",
                message: "Please enter correct Email",
                code: "INVALID_INPUT",
              },
            ],
          };
          res.status(409).send({ data: emailError });
        }
      }
    }
  }
});

router.post("/verify", async (req, res) => {
  if (req.body) {
    const { otp, token, user } = req.body;
    const { newInstructor, authOTP } = req.session;

    if (token) {
      if (otp == token) {
        const hashPassword = await bcrypt.hash(user.password, 10);

        const newUser = new Instructor({
          email: user.email,
          name: user.name,
          password: hashPassword,
          google: false,
        });
        await newUser.save();

        const users = await Instructor.findOne({ email: user.email });
        const token1 = await createToken(users._id);

        const success = {
          status: true,
          content: {
            data: {
              id: users._id,
              name: users.name,
              email: users.email,
              image: users.image,
              created_at: users.createdAt,
            },
            meta: {
              access_token: token1,
            },
          },
        };
        res.status(200).send({ data: success });
      } else {
        const emailError = {
          status: false,
          errors: [
            {
              param: "otp",
              message: "Entered Wrong OTP",
              code: "INVALID_INPUT",
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
            param: "email",
            message: "Session Expired. Try again",
            code: "INVALID_INPUT",
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
          param: "email",
          message: "No inputs received",
          code: "INVALID_INPUT",
        },
      ],
    };
    res.status(409).send({ data: emailError });
  }
});

router.post("/login", async (req, res) => {
  const { email, password, google } = req.body;
  if (req.body) {
    if (google) {
      const users = await Instructor.findOne({ email });
      if (users) {
        const token = await createToken(users._id);
        const courseData = await Course.find({
          instructor: users._id,
        });
        const success = {
          status: true,
          content: {
            data: users,

            courses: courseData,
            meta: {
              access_token: token,
            },
          },
        };
        res.status(200).send({ data: success });
      } else {
        const emailError = {
          status: false,
          errors: [
            {
              param: "email",
              message: "no user found",
              code: "INVALID_INPUT",
            },
          ],
        };
        res.status(409).send({ data: emailError });
      }
    } else {
      const users = await Instructor.findOne({ email });
      if (users) {
        if (users.google === true) {
          const emailError = {
            status: false,
            errors: [
              {
                param: "email",
                message: "Please login using google Account",
                code: "INVALID_INPUT",
              },
            ],
          };
          res.status(409).send({ data: emailError });
        } else {
          const match = await bcrypt.compare(password, users.password);
          if (match) {
            const token = await createToken(users._id);
            const courseData = await Course.find({
              instructor: users._id,
            });
            const success = {
              status: true,
              content: {
                data: users,
                meta: {
                  access_token: token,
                },
              },
            };
            res.status(200).send({ data: success });
          } else {
            const emailError = {
              status: false,
              errors: [
                {
                  param: "password",
                  message: "incorrect password",
                  code: "INVALID_INPUT",
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
              param: "email",
              message: "no user found",
              code: "INVALID_INPUT",
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
          param: "email",
          message: "No inputs received",
          code: "INVALID_INPUT",
        },
      ],
    };
    res.status(409).send({ data: emailError });
  }
});

router.post("/update-profile", async (req, res) => {
  console.log(req.body);
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];
  const secretKey = process.env.JWT;
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

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      const emailError = {
        status: false,
        errors: [
          {
            param: "access denied",
            message: "Unautharized Access",
            code: "No access",
          },
        ],
      };
      res.status(409).send({ data: emailError });
    } else {
      Instructor.findOne({ _id: decoded._id }).then(async (user) => {
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
    }
  });
});

router.post("/update-course", async (req, res) => {
  const { authorization } = req.headers;

  const token = authorization.split(" ")[1];

  const secretKey = process.env.JWT;
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
  } = req.body;

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      const emailError = {
        status: false,
        errors: [
          {
            param: "access denied",
            message: "Unautharized Access",
            code: "No access",
          },
        ],
      };
      res.status(409).send({ data: emailError });
    } else {
      Instructor.findOne({ _id: decoded._id }).then(async (user) => {
        Course({
          name: name,
          headline: headline,
          description: description,
          image: image,
          status: "active",
          field: field,
          price: price,
          experience: experience,
          total: total,
          topics: topics,
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
    }
  });
});

router.get("/fetch-course", (req, res) => {
  const { authorization } = req.headers;
  
  const token = authorization.split(" ")[1];

  const secretKey = process.env.JWT;
  jwt.verify(token, secretKey,async (err, decoded) => {
    if (err) {
      const emailError = {
        status: false,
        errors: [
          {
            param: "access denied",
            message: "Unautharized Access",
            code: "No access",
          },
        ],
      };
      res.status(409).send({ data: emailError });
    } else {
      const AllCourse = await Course.find({ instructor: decoded._id })
      const success = {
        status: true,
        content: {
          data: AllCourse,
        },
      };
      res.status(200).send({ data: success });
      
    }
});
})



module.exports = router;