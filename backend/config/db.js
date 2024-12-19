const mongoose=require('mongoose')

const connectDb=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('mongodb coneectred')
    } catch (error) {
        console.log('error connecting to mongodb',error)
    }
    
}
module.exports=connectDb;