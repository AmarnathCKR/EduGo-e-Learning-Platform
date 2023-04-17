const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");
const { Instructor } = require("../../database/Instructor");
const { Course } = require("../../database/Course");
const {Admin} = require("../../database/Admin");
const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT, { expiresIn: "1d" });
  };


exports.adminLogin = async (req,res) => {
    
    if(req.body){
        const {email, password}=req.body;
        const admin = await Admin.findOne({email : email})
        
        if(admin){
            console.log('admin')
            const match = await bcrypt.compare(password, admin.password);
          if (match) {
            const token = await createToken(admin._id);

              const success = {
                status: true,
                content: {
                  data: admin,
                  meta: {
                    access_token: token,
                  },
                },
              };
              res.status(200).send({ data: success });
        }else{
            const emailError = {
                status: false,
                errors: [
                  {
                    param: "no inputs",
                    message: "wrong password",
                    code: "INVALID_INPUTS",
                  },
                ],
              }; 
              res.status(409).send({ data: emailError });
        }
    }else{
        console.log(' no admin')
        const emailError = {
            status: false,
            errors: [
              {
                param: "no inputs",
                message: "Please enter valid credentials",
                code: "INVALID_INPUTS",
              },
            ],
          };
          res.status(409).send({ data: emailError });
    }

}
}