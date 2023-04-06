const router = require("express").Router();

const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Snowflake } = require("@theinternetfolks/snowflake");

const nodemailer = require("nodemailer");
const { Course } = require("../database/Course");
const { Student } = require("../database/Student");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT, { expiresIn: "1d" });
};

router.get("/fetch-allCourse", async (req, res) => {
  const allCourse = await Course.find();
  console.log("hgjhghjgh");
  const success = {
    status: true,
    content: {
      data: allCourse,
    },
  };
  res.status(200).send({ data: success });
});

router.post("/signup", async (req, res) => {
  const { name, email, image, password, google } = req.body;
  if (google === true) {
    if (email) {
      const user = await Student.findOne({ email });
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
        const newUser = new Student({
          name: name,
          email: email,
          image: image,
          google: true,
        });

        await newUser.save();

        const users = await Student.findOne({ email });
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
      const member = await Student.findOne({ email });
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

            req.session.newStudent = {
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
    const { newStudent, authOTP } = req.session;

    if (token) {
      if (otp == token) {
        const hashPassword = await bcrypt.hash(user.password, 10);

        const newUser = new Student({
          email: user.email,
          name: user.name,
          password: hashPassword,
          google: false,
        });
        await newUser.save();

        const users = await Student.findOne({ email: user.email });
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
  console.log("i was herer");
  const { email, password, google } = req.body;
  if (req.body) {
    if (google) {
      const users = await Student.findOne({ email });
      if (users) {
        const token = await createToken(users._id);

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
              param: "email",
              message: "no user found",
              code: "INVALID_INPUT",
            },
          ],
        };
        res.status(409).send({ data: emailError });
      }
    } else {
      const users = await Student.findOne({ email });
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
      Student.findOne({ _id: decoded._id }).then(async (user) => {
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
    }
  });
});

router.get("/search", async (req, res) => {
  if (req.query.search) {
    const { search } = req.query;
    console.log(search);
    const data = await Course.find({
      $or: [{ name: { $regex: "^" + search + ".*", $options: "i" } }],
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
});

module.exports = router;
