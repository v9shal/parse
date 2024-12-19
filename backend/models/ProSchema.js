const mongoose =require ('mongoose');

const ProSchema = mongoose.Schema(
  {
    title: { 
      type: String, 
      required: [true, 'Title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [1000, 'Description cannot exceed 500 characters'],
      trim: true
    },
    smallDescription:{
      type:String,
      required:true,
      maxlength:[500,'Description is excedding 100 character'],
      trim:true,
    },
    status:{
      type:String,
      required:true,
      trim:true

    },
    deadline:{
      type:Date,
      
    },
    skillsRequired:{
      type:String,
      trim:true
    },
    createdBy:{type:String,required:true}
  },
  { timestamps: true }
);
ProSchema.index({ title: 1 });
const Project = mongoose.model('Project', ProSchema);

// Exporting the model for use in other parts of the application
module.exports=mongoose.model('Project',ProSchema);