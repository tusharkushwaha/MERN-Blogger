const mongoose = require("mongoose")
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please enter a username"]
    },
    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: true,
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please provide a valid email"]
    },
    password: {
        type: String,
        minlenght: [6, "Password should be atleast 6 character long"]
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    imageurl: {
        type: String,
        default: "https://res.cloudinary.com/tusharkushwaha/image/upload/v1617882318/vz5udv0foywg7zupbesb.jpg"
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    mobilenumber:{
        type:Number
    },
    bio:{
        default:"The more I know, more I know how less I know.",
        type:String
    },
    googleid:{
        type:String
    }

})

const User = new mongoose.model("User", UserSchema);
module.exports = User;