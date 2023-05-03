const router = require("express").Router();

const {
  studentSearch,
  updateStudentProfile,
  fetchAllCourse,
  fetchStudent,
  fetchAllFields,
  findStudentCourseByID,
  streamVideo,
  searchCoupon,
  purchase,
  getOrder,
  getStatus,
} = require("../controllers/student/studentActions");
const {
  studentLogin,
  studentsVerify,
  studentCreate,
  displayCourses,
  getOwnedCourse,
} = require("../controllers/student/studentManage");
const studentAuth = require("../middlewares/student/studentAuth");

const instructorProfileValidator = require("../middlewares/instructor/instructorProfileValidator");


router.get("/fetch-allCourse", fetchAllCourse);

router.post("/signup", studentCreate);

router.post("/verify", studentsVerify);

router.post("/login", studentLogin);

router.post("/update-profile", studentAuth, instructorProfileValidator ,updateStudentProfile);

router.get("/search", studentSearch);

router.get("/fetch-student",studentAuth, fetchStudent);

router.get("/display-courses", displayCourses);

router.get("/get-purchasedCourse",studentAuth, getOwnedCourse)

router.get("/get-status", studentAuth, getStatus)

router.get("/fetch-fields", fetchAllFields);

router.get("/get-course",studentAuth, findStudentCourseByID)

router.get("/search-coupon", studentAuth,searchCoupon)

router.get("/get-order", studentAuth, getOrder)

router.get("/stream/video",streamVideo)

router.post("/purchase",studentAuth, purchase)

module.exports = router;
