const router = require("express").Router();

const {
  verifyInstructor,
  createInstructor,
  instructorLogin,
  allCategory,
  test,
  findConversation,
  sendMessage,
  getMessage,
} = require("../controllers/instructor/instructorManage");
const {
  updateProfile,
  updateInstructorCourse,
  fetchInstructorCourse,
  fetchInstructor,
  searchCourse,
  findCourseByID,
  ediInstructorCourse,
  generateOTP,
  setPayment,
  getAllPayments,
} = require("../controllers/instructor/instructorActions");
const instructorAuth = require("../middlewares/instructor/instructorAuth");
const instructorProfileValidator = require("../middlewares/instructor/instructorProfileValidator");
const instructorCourseValidator = require("../middlewares/instructor/instructorCourseValidater");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT, { expiresIn: "1d" });
};

router.post("/signup", createInstructor);

router.post("/verify", verifyInstructor);

router.post("/login", instructorLogin);

router.post("/update-profile", instructorAuth, instructorProfileValidator, updateProfile);

router.post("/update-course", instructorAuth,instructorCourseValidator, updateInstructorCourse);

router.get("/fetch-course", instructorAuth, fetchInstructorCourse);

router.get("/fetch-user",instructorAuth, fetchInstructor)

router.get("/get-field",allCategory)

router.get("/search",searchCourse)

router.get("/get-course",instructorAuth, findCourseByID)

router.post("/edit-course", instructorAuth, instructorCourseValidator,ediInstructorCourse)


router.get("/generate-otp", instructorAuth ,generateOTP)


router.post("/send-message", instructorAuth , sendMessage)

router.get("/get-message",instructorAuth, getMessage)

router.post("/set-payment",instructorAuth,setPayment)

router.get("/get-payment", instructorAuth,getAllPayments)

module.exports = router;
