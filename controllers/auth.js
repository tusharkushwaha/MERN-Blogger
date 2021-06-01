const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail")
const ErrorResponse = require("../utils/errorResponse");



register = async (req, res, next) => {
    const { password } = req.body
    try {
        const salt = await bcrypt.genSalt(8);
        req.body.password = await bcrypt.hash(password, salt);
        const user = await User.create(req.body)
        getToken(user, 201, res)
    } catch (err) {
        // res.status(500).json({success: false, error:err.message})
        next(err)

    }
}
login = async (req, res, next) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {

            // res.status(401).json({success:false, error:"Invalid credentials"})
            return next(new ErrorResponse("Invalid credentials", 401))
        } else {
            const isPasswordMatch = await bcrypt.compare(password, user.password)
            if (isPasswordMatch) {
                getToken(user, 200, res)
            } else {
                // res.status(401).json({success:false, error:"Invalid credentials"})
                return next(new ErrorResponse("Invalid credentials", 401))
            }
        }
    } catch (err) {
        return next(new ErrorResponse(err.message, 500))
        // res.status(500).json({success:false, error:err.message})
    }
}
profile = async (req, res, next) => {
    try {
        const { username, firstname, lastname, email, mobilenumber, imageurl, bio } = req.user
        res.status(200).json({ success: true, user: { username, firstname, lastname, email, mobilenumber, imageurl, bio } })
    } catch (err) {
        next(err)
    }
}
profileupdate = async (req, res, next) => {
    try {
        const updatedprofile = await User.findOneAndUpdate({ _id: req.user._id }, req.body, { new: true })
        const { username, email, imageurl } = updatedprofile
        res.status(200).json({ success: true, details: { username, email, imageurl } })
    } catch (err) {
        console.log(err);
        next(err)
    }
}
forgotpassword = async (req, res, next) => {
    const { email } = req.body
    try {
        const user = await User.findOne({ email })

        if (!user) return next(new ErrorResponse("Email is not registerd", 404))

        const resetToken = crypto.randomBytes(20).toString("hex")
        user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
        const resetPasswordExpire = Date.now() + 10 * 60 * 1000
        user.resetPasswordExpire = resetPasswordExpire;
        await user.save()
        const resetUrl = `https://blogger.kushwahatushar.tech/resetpassword/${resetToken}`
        const message = `
            <h1>You have requested a password reset </h1>
            <p>Please go to this link to reset your password</p>
            <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        `
        try {
            await sendEmail({
                to: user.email,
                subject: "Password Reset Request",
                text: message

            })
            res.status(200).json({ success: true, data: "email sent" })
        } catch (err) {
            user.resetPasswordToken = undefined
            user.resetPasswordExpire = undefined
            await user.save()
            console.log(err);
            return next(new ErrorResponse("Email could not be sent", 500))
        }
    } catch (err) {
        next(err)
    }
}

resetpassword = async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex")
    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        })
        if (!user) return next(new ErrorResponse("Invalid Reset Token", 400))
        const salt = await bcrypt.genSalt(8);
        req.body.password = await bcrypt.hash(req.body.password, salt);
        user.password = req.body.password
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save()
        res.status(201).json({
            success: true,
            data: "Password reset successful"
        })
    } catch (err) {
        console.log((err));
        next(err)
    }
}

googleLogin = async (req, res, next) => {
    const { email } = req.body
    try {
        const googleuser = await User.findOne({ email })
        if (googleuser) getToken(googleuser, 201, res)
        else {
            const user = await User.create(req.body)
            getToken(user, 201, res)
        }
    } catch (err) {
        console.log(err);
    }
}

const getToken = (user, statusCode, res) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })
    const { username, email, imageurl } = user
    res.status(statusCode).json({ success: true, token, details: { username, email, imageurl } })
}
module.exports = { register, login, forgotpassword, resetpassword, profile, profileupdate, googleLogin }