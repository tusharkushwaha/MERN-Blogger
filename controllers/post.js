const postSchema = require("../models/postSchema");
const ErrorResponse = require("../utils/errorResponse");


exports.createpost = async (req, res) => {
    req.body.user = req.user._id
    req.body.userimage = req.user.imageurl
    req.body.username = req.user.username
    try {
        await postSchema.create(req.body)
        res.status(200).json({ success: true })

    } catch (err) {
        console.log(err);
    }
}

// -------------------------
exports.editpost = async (req, res) => {
    const { title, bodyOfEditor, privacy, imageurl } = req.body
    try {
        const findpost = await postSchema.findById( req.params.id)
        if (JSON.stringify(req.user._id) === JSON.stringify(findpost.user)){
            await postSchema.findByIdAndUpdate(req.params.id, { title, bodyOfEditor, privacy, imageurl })
            res.status(200).json({ success: true })
        }
        else{
            res.status(404).json({success:true, error:"Not allowed to edit this post"})
        }
       
    } catch (err) {
        console.log(err);
    }
}

// -----------------------------------------
exports.viewpostyours = async (req, res) => {
    // change this to increase the privacy
    try {
        const posts = await postSchema.find({ user: req.user._id }).sort({ "createdate": -1 })
        res.status(200).json({ success: true, posts })
    } catch (err) {
        console.log(err);
    }
}

// -----------------------------

// ------------------------------------------
exports.viewpostothers = async (req, res) => {
    try {
        const othersPosts = await postSchema.find({
            user: { $ne: req.user._id },
            privacy: "public"
        }).sort({ "createdate": -1 })
        res.status(200).json({ success: true, posts: othersPosts })
    } catch (err) {
        console.log(err);
    }
}
// ---------------------------
exports.viewpost = async (req, res, next) => {
    const { _id } = req.user
    try {
        const viewposts = await postSchema.findById(req.params.id)
        const { user, privacy } = viewposts
        if (privacy === "public") {
            res.status(200).json({ success: true, post: viewposts })
        }
        else {
            if (JSON.stringify(_id) === JSON.stringify(user)) res.status(200).json({ success: true, post: viewposts })
            else res.status(404).json({ success: false, error: "Not allowed to view this page" })
        }
    } catch (err) {
        console.log(err);
    }
}
// -------------------------------------------
exports.deletepost = async (req, res, next) => {
    try {
        const deletepost = await postSchema.findById(req.params.id)
        if (JSON.stringify(req.user._id) === JSON.stringify(deletepost.user)) {
            const deletepost = await postSchema.findByIdAndDelete(req.params.id)
            res.status(200).json({ success: true })
        }
        else res.status(404).json({success:false, error:"error 404"})
    } catch (err) {
        console.log(err);
    }
}
exports.homescreenposts = async (req,res)=>{
    try {
        const homepost = await postSchema.find({privacy: "public"}).limit(4)
        res.status(200).json({success:true, posts:homepost})
    } catch (err) {
        console.log(err);
    }
}
