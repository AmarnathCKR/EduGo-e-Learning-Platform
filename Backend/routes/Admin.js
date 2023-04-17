const { adminLogin } = require("../controllers/admin/adminAuth");
const { createFields, fetchAllFields, deleteField, getField, editField, getAllCourse, getCourseData } = require("../controllers/admin/adminManage");
const adminAccess = require("../middlewares/admin/adminAccess");

const router = require("express").Router();


router.post("/login", adminLogin)

router.post("/create-field", adminAccess, createFields)

router.get("/fetch-field", adminAccess , fetchAllFields)

router.delete("/delete-field", adminAccess , deleteField)

router.get("/get-field",adminAccess, getField)

router.post("/edit-field", adminAccess, editField)

router.get("/fetch-course",adminAccess,getAllCourse)

router.get("/get-course",adminAccess, getCourseData)


module.exports = router;