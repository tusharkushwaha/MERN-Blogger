const express = require("express")
const router = express.Router()
const protect = require("../middlewares/auth")
const {createpost, viewpostyours, viewpostothers, viewpost, deletepost, editpost, homescreenposts} = require("../controllers/post")


router.post("/createpost",protect, createpost)
router.get("/viewpost/yours",protect,viewpostyours)
router.put("/editpost/:id",protect,editpost)
router.get("/viewpost/others",protect,viewpostothers)
router.get("/viewpost/home",homescreenposts)
router.get("/viewpost/:id",protect,viewpost)
router.delete("/deletepost/:id",protect,deletepost)

module.exports =router