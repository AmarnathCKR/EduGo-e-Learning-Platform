const router = require("express").Router();

const {
  studentSearch,
  updateStudentProfile,
  fetchAllCourse,
  fetchStudent,
} = require("../controllers/student/studentActions");
const {
  studentLogin,
  studentsVerify,
  studentCreate,
} = require("../controllers/student/studentManage");
const studentAuth = require("../middlewares/student/studentAuth");



router.get("/fetch-allCourse", fetchAllCourse);

router.post("/signup", studentCreate);

router.post("/verify", studentsVerify);

router.post("/login", studentLogin);

router.post("/update-profile", studentAuth, updateStudentProfile);

router.get("/search", studentSearch);

router.get("/fetch-student",studentAuth, fetchStudent);

module.exports = router;
