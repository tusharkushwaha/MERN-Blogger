const jwt = require("jsonwebtoken")
const User = require("../models/User")
const errorResponse = require("../utils/errorResponse")

const protect = async(req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1]
    }
    if(!token){
        return next(new errorResponse("Not authorized to access this code", 401))
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id)
        if(!user){
            return next(new errorResponse("NO User found with this id", 404))
        }
        req.user = user;
        next()
    } catch (err) {
        return next(new errorResponse("Not authorized to access this route",401))
    }
} 
module.exports = protect