const { adminLogin } = require("../controllers/admin/adminAuth");
const { createFields, fetchAllFields } = require("../controllers/admin/adminManage");
const adminAccess = require("../middlewares/admin/adminAccess");

const router = require("express").Router();


router.post("/login", adminLogin)

router.post("/create-field", adminAccess, createFields)

router.get("/fetch-field", adminAccess , fetchAllFields)


module.exports = router;