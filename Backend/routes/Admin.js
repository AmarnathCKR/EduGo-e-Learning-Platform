const { adminLogin } = require("../controllers/admin/adminAuth");
const { createFields, fetchAllFields, blockField, getField, editField, getAllCourse, getCourseData, changeCourse } = require("../controllers/admin/adminManage");
const adminAccess = require("../middlewares/admin/adminAccess");

const router = require("express").Router();


router.post("/login", adminLogin)

router.post("/create-field", adminAccess, createFields)

router.get("/fetch-field", adminAccess , fetchAllFields)

router.delete("/delete-field", adminAccess , blockField)

router.get("/get-field",adminAccess, getField)

router.post("/edit-field", adminAccess, editField)

router.get("/fetch-course",adminAccess,getAllCourse)

router.get("/get-course",adminAccess, getCourseData)


router.patch("/course-status",adminAccess, changeCourse)

module.exports = router;