const { adminLogin } = require("../controllers/admin/adminAuth");
const { createFields, fetchAllFields, blockField, getField, editField, getAllCourse, getCourseData, changeCourse, createCoupons, fetchAllCoupons, blockCoupon, getCoupon, editCoupon, getMonthlyData, getAllAdminData, getAllOrder } = require("../controllers/admin/adminManage");
const adminAccess = require("../middlewares/admin/adminAccess");

const router = require("express").Router();


router.post("/login", adminLogin)

router.post("/create-field", adminAccess, createFields)

router.get("/fetch-field", adminAccess, fetchAllFields)

router.delete("/delete-field", adminAccess, blockField)

router.get("/get-field", adminAccess, getField)

router.post("/edit-field", adminAccess, editField)




router.post("/create-coupon", adminAccess, createCoupons)

router.get("/fetch-coupon", adminAccess, fetchAllCoupons)

router.delete("/delete-coupon", adminAccess, blockCoupon)

router.get("/get-coupon", adminAccess, getCoupon)

router.post("/edit-coupon", adminAccess, editCoupon)





router.get("/fetch-course", adminAccess, getAllCourse)

router.get("/get-course", adminAccess, getCourseData)

router.get("/get-analytic", adminAccess,getMonthlyData)

router.get("/get-users", adminAccess,getAllAdminData)

router.get("/get-all", adminAccess,getAllOrder)



router.patch("/course-status", adminAccess, changeCourse)

module.exports = router;