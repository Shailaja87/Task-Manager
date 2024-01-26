const express=require('express')
const router = new express.Router()
const auth=require('../middleware/auth')
const Task=require('../models/tasks')


router.post('/tasks',auth,async (req,res)=>{
    const task1=new Task({
        ...req.body,
        Auther:req.user._id})
        console.log(task1)
    try{
    await task1.save()
    
    res.send(task1)
    }catch(e){
        res.status(400).send()
    }
})



router.get('/tasks',auth ,async(req,res)=>{
    try{
    if(req.query.completed){
        const complete= req.query.completed==='true'
        const task1=await Task.find({Auther:req.user._id,completed:complete})
        res.send(task1)
    }
    else{
        const task1=await Task.find({Auther:req.user._id})
        res.send(task1)
    }}
    catch(e){
        res.status(400).send()
    }

    
})

router.get('/tasks/:id',auth,async(req,res)=>{
    const id=req.params.id
    try{
        const task1=await Task.findOne({_id:id, Auther:req.user._id})
        if(task1){
            res.send(task1)
        }
        else{
            res.status(400).send()
        }
    }catch(e){
        res.status(400).send()
    }
})


router.patch('/tasks/:id',auth,async(req,res)=>{
    const id=req.params.id
    const updates=Object.keys(req.body)
    const validupdates=['completed']
    const isValid=updates.every((update)=>{
        return validupdates.includes(update)
    })
    
    if(isValid){
    try{
        const task=await Task.findOne({_id:id,Auther:req.user._id})
        console.log(task)
        if(task){
        updates.forEach((update)=>{
            task[update]=req.body[update]
        })
        await task.save()
        //const task=await Task.findByIdAndUpdate(id,req.body,{new:true,runValidators:true})
        
        res.send(task)}
        else{
            throw new Error("Task doesn't exist")
        }
    }
    catch(e){
        res.status(400).send(e)
    }}
    else{
        res.status(400).send("Fields can't be updated")
    }

})

router.delete('/task/:id',auth,async(req,res)=>{
    const id=req.params.id
    try{
        await Task.deleteOne({_id:id,Auther:req.user._id})
        res.send("Deleted Task successfully")
    }
    catch(error){
        res.status(400).send()
    }
})

module.exports=router