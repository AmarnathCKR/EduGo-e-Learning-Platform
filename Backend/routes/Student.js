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
  generateCookie,
  courseCount,
  sendNewMessage,
  getAllMessages,
  getStudentDetails,
  addNewReview,
  deleteReview,
  getReviews,
  getMyReviews,

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
const instructorAuth = require("../middlewares/instructor/instructorAuth");


router.get("/fetch-allCourse", fetchAllCourse);

router.post("/signup", studentCreate);

router.post("/verify", studentsVerify);

router.post("/login", studentLogin);

router.post("/update-profile", studentAuth, instructorProfileValidator, updateStudentProfile);

router.get("/search", studentSearch);

router.get("/fetch-student", studentAuth, fetchStudent);

router.get("/display-courses", displayCourses);

router.get("/get-purchasedCourse", studentAuth, getOwnedCourse)

router.get("/get-status", studentAuth, getStatus)

router.get("/fetch-fields", fetchAllFields);

router.get("/get-course", studentAuth, findStudentCourseByID)

router.get("/search-coupon", studentAuth, searchCoupon)

router.get("/get-order", studentAuth, getOrder)

router.get("/stream/video", streamVideo)

router.post("/purchase", studentAuth, purchase)

router.get("/generate-cookie", instructorAuth, generateCookie)

router.get("/get-count", studentAuth, courseCount)

router.post("/send-message", studentAuth, sendNewMessage)

router.get("/get-message", studentAuth, getAllMessages)

router.get("/get-student", getStudentDetails)

router.post("/add-review", studentAuth, addNewReview)

router.get("/get-review", studentAuth,getReviews)

router.get("/get-my-review", studentAuth,getMyReviews)


router.get("/delete-review", studentAuth, deleteReview)



module.exports = router;
