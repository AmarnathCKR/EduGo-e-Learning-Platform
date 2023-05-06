const router = require("express").Router();

const {
  verifyInstructor,
  createInstructor,
  instructorLogin,
  allCategory,
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


module.exports = router;
