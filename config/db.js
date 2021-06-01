const mongoose = require("mongoose")

const mongoDB = mongoose.connect(process.env.MONGOURL,{
     useNewUrlParser:true,
     useUnifiedTopology:true,
     useCreateIndex:true,
     useFindAndModify:false
}).then(()=>{
     console.log("MongoDB connected");
}).catch((e)=>{
    console.log(e);
     console.log("MongoDB not connected");
})
module.exports = mongoDB;