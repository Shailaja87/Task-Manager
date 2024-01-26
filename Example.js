require('./src/db/mongoose')
const User=require('./src/modules/user')

const id='64c385952d8501e5b35d2639'

const asyncFunc=async (id)=>{
    const deleted=await User.findByIdAndDelete(id)
    const count=await User.countDocuments({age:20})
    return count

}

asyncFunc(id).then((resolve)=>{
    console.log(resolve)
}).catch((error)=>{
    console.log(error)
})