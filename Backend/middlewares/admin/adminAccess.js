const jwt = require("jsonwebtoken");
const { Instructor } = require("../../database/Instructor");

const adminAccess = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];
  const secretKey = process.env.JWT;
  jwt.verify(token, secretKey, async (err, decoded) => {
    if (err) {
      const emailError = {
        status: false,
        errors: [
          {
            param: "user blocked",
            message: "User have been blocked",
            code: "USER_BLOCKED",
          },
        ],
      };
      res.status(409).send({ data: emailError });
    } else {
      req.params.id = decoded._id;
      next();
    }
  });
};

module.exports = adminAccess;
