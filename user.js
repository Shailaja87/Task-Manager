const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Task = require('./tasks')

const UserSchema=new mongoose.Schema({
    Name:{
        type:String,
        required:true,
        lowercase:true,
       

    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        validate(email){
            if(!validator.isEmail(email))
            {
                throw new error("Email is not correct")
            }
        }

    },
    age:{
        type:Number,
        default:10,
        validate(age){
            if(age<0){
            throw new error("age should be positive")
        }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        validate(password){
            if(password.length<6){
               if(password.incldes("password")){
                throw new error("Enter valid password")
               } 
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
    
},{timestamps:true})
UserSchema.methods.toJSON= function(){
        const user=this
        const userjson=user.toObject()
        const newuser=userjson

        delete newuser.password
        delete newuser.tokens
        return newuser


}
UserSchema.virtual('tasks',{
    rel:'Task',
    localField:'_id',
    foreignField:'Auther'

})
UserSchema.methods.getAutheticatiotoken=async function(){
    const user=this
    const token=jwt.sign({"_id":user._id.toString()},"Fornewuser")
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token

}
UserSchema.statics.findBycredentials=async (email,password)=>{
    const user= await User.findOne({email})
    if(user){
        const isExist =await bcrypt.compare(password,user.password)
        if(isExist){
            return user
        }
        else{
            throw new error("Invalid login")
        }
    }
    else{
        throw new error("Invalid login")
    }

}
UserSchema.pre('remove',async function(next){
    const user=this
    await Task.deleteMany({Auther:user._id})
    next()

})
UserSchema.pre('save',async function(next){
    const user=this
    if(user.isModified('password')){
    user.password = await bcrypt.hash(user.password,8)
    console.log("saving")
}
    
    next()
})

const User=mongoose.model('users',UserSchema)



module.exports=User;