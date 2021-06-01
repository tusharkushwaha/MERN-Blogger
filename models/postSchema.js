const User = require("./User")
const mongoose = require("mongoose");
const moment = require("moment")

const date = moment().utcOffset("+0530").format('MMMM Do YYYY, h:mm a');
const post_schema = new mongoose.Schema({
     title:{
          type:String,
          required: true
     },
     bodyOfEditor:{
          type:String
     },
     user:{
          type: mongoose.Schema.Types.ObjectId,
          ref: User
     },
     date:{
          type: String,
          default: date
     },
     imageurl:{
         type:String,
         default:"/images/post.svg"
     },
     privacy:{
         type:String
     },
     createdate:{
          type:Date,
          default: Date.now()
     },
     userimage:{
          type:String
     },
     username:{
          type:String
     }
})

module.exports = mongoose.model("Post",post_schema)