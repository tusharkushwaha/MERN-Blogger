const { model } = require("mongoose");
const errorResponse = require("../utils/errorResponse")

const errorHandler = (err, req, res, next)=>{
    let error = { ...err };
    error.message = err.message
    
    if(err.code === 11000){
        const message = "Duplicate field value enter",
        error = new errorResponse(message,400)
    }
    if (err.name === "validation error") {
        const message = Object.values(err.errors).map((val)=> val.message)
        error = new errorResponse(message,400)
   }
    res.status(error.statuscode || 500).json({
        success:false,
        error: error.message || "Server error"
    })
}
module.exports = errorHandler;