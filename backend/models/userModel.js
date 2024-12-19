const mongoose= require('mongoose')
const bcrypt=require('bcrypt');
const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long'],
      maxlength: [20, 'Username must be less than 20 characters']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long']
    },
     role:{
      type:String,
      required:[true,"role is required"],
      
    }
  }, { timestamps: true });

  userSchema.pre('save',async function (next){
 if(!this.isModified('password'))return next();
 try {
    const salt=await bcrypt.genSalt(10);
    this.password=bcrypt.hash(this.password,salt)
    next();
 } catch (error) {
    next(error)
 }
  })
  userSchema.methods.isValidPassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };

module.exports=mongoose.model('User',userSchema);