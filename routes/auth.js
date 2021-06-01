const express = require("express")
const router = express.Router()
const { login, register, forgotpassword, resetpassword, profile, profileupdate, googleLogin } = require("../controllers/auth")
const protect = require("../middlewares/auth")

router.post("/login",login)
router.post("/register",register)
router.post("/goolelogin", googleLogin)
router.get("/profile",protect,profile)
router.post("/profileupdate",protect,profileupdate)
router.post("/forgotpassword",forgotpassword)
router.put("/resetpassword/:resetToken",resetpassword)
module.exports = router;