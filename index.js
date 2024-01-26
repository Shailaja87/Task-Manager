const express=require('express')
require('./db/mongoose')
const Userrouter=require('./routers/users.js')
const Taskrouter=require('./routers/tasks.js')

const app=express()

app.use(express.json())

app.use(Userrouter)
app.use(Taskrouter)
app.listen(3000,(error)=>{
    if(error){
    console.log(error)
}
})


// const Task=require('./models/tasks.js')

// const func=async (req,res)=>{
//     const task=Task.findById()
// }