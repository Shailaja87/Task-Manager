const jwt=require('jsonwebtoken')
const User=require('../models/user')
const auth= async (req,res,next)=>{
    try{
    const token=req.header('Authorization').replace('Bearer ','')
    
    const data= jwt.verify(token,'Fornewuser')
    
    const user= await User.findOne({_id:data._id,'tokens.token':token})
    if(!user){
        throw new Error("Error")
    }
    req.token=token
    req.user=user
    next()}
    catch(e){
        res.status(400).send({'error':"Autheticate first"})
    }
    // console.log("authorization")
    // next()

}
module.exports=auth