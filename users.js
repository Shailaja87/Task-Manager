const express=require('express')
const router = new express.Router()
const User=require('../models/user.js')
const auth=require('../middleware/auth')



router.post('/users',async (req,res)=>{
    const user1=new User(req.body)
    try{
    const token= await user1.getAutheticatiotoken();
    await user1.save()
    res.status(201).send({user1,token}
        )
    }
    catch(e){
        res.status(400).send(e)
    }
    
    
})
router.post("/users/logoutAll",auth,async(req,res)=>{
    try{
    req.user.tokens=[]
    await req.user.save()
    res.send()
}
    catch{
        res.status(400).send("error")
    }
})
router.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token !==req.token
        })
        await req.user.save()
        res.send()}
        catch(e){
            res.status(400).send()
        }
}
)
router.get('/users/me',auth,async(req,res)=>{
    try{
        res.send(req.user)
    }catch(e){
        res.status(303).send()
    }
    
})
// router.get('/users/:id',auth,async(req,res)=>{
//     const _id=req.params.id
//     try{
//     const user1=await User.findById(_id)
//     if(user1){
//         res.send(user1)
        
//     }else{
//         return res.status(401).send()
//     }
// }catch(e){
//     res.status(400).send()
// }

// })
router.post('/users/login',async(req,res)=>{
    try{
        const user=await User.findBycredentials(req.body.email,req.body.password)
        if(user){
            const token=await user.getAutheticatiotoken();
            res.send({user,token})
        }
        else{
            res.status(401).send()
        }
    }catch(e){
        res.send("Error has occured")
    }
})
router.patch('/users/me',auth,async(req,res)=>{
    
   
    try{
        const updates=Object.keys(req.body);
        const ValidOperation=['Name','age','password']
        const isValidOpeartion=updates.every((update)=>ValidOperation.includes(update))
        if(isValidOpeartion){
        
        updates.forEach((update)=>{
            req.user[update]=req.body[update]
        })
        await req.user.save()
        //const user=await User.findByIdAndUpdate(id,req.body,{new:true,runValidators:true})
        if(req.user){
        res.send(req.user)}
        else{
            res.status(400).send()
        }}
        else{
            res.status(400).send('Error:Updating Email or password is not possible')
        }
        
    }
    catch(error){
        res.status(400).send()
    }
})
router.delete('/users/me',auth,async (req,res)=>{
    
    try{
        await User.findByIdAndDelete(req.user._id)
        // await User.remove({_id:req.user._id})
        res.send("deleted successfully")
    }
    catch(e){
        res.status(400).send()
    }})

module.exports=router