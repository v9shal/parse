const ProjectProvider =require( '../models/project-providerModel');
const mongoose =require( 'mongoose');
const Project =require('../models/ProSchema');
class ProjectProviderControl {
  static validateId = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid project ID format');
    }
  };

  static handleError(res, error, defaultMessage = 'An error occurred') {
    console.error(error);
    return res.status(500).json({
      message: defaultMessage,
      error: error.message,
    });
  }
  static getPendingProvider=async(req,res)=>{
    try {
        const {projectId}=req.params;
        if(!projectId){
          return res.status(400).json({message:"projectId  is requried"});
        }
        const fetchpendingProviders= await ProjectProvider.find({
          project_id:projectId,
          status:"pending"
        })
        if(!fetchpendingProviders){
          res.staus(404).json({message:"no projects to fetch"})
        }
        return res.status(200).json({
          message: `here are the fetched pending provider for ${projectId}`,
          providers: fetchpendingProviders
      });
    } catch (error) {
      this.handleError(res,error,"error while finding the pending providers");

    }
  }
  static updateStatusProvider = async (req, res) => {
    try {
        const { projectId, username } = req.params;
        const { status } = req.body;

        if (!["accepted", "rejected"].includes(status)) {
            return res.status(400).json({ message: 'invalid status' });
        }

        // Verify project ownership
        // const project = await Project.findOne({ _id: projectId, username: req.user.username });
        // if (!project) {
        //     return res.status(403).json({ message: "Unauthorized action" });
        // }

        // Update using correct query parameters
        const updateStatus = await ProjectProvider.findOneAndUpdate(
            { project_id: projectId, username: username },
            { status },
            { new: true }
        );

        if (!updateStatus) {
            return res.status(404).json({ message: "no provider to update" });
        }

        return res.status(200).json({
            message: `Status updated for provider ${username} in project ${projectId}`,
            provider: updateStatus
        });

    } catch (error) {
        this.handleError(res, error, "error while updating the status");
    }
}

  static applyToProject = async (req, res) => {
    try {
      const { project_id, username } = req.body;
      this.validateId(project_id);
      if (!project_id || !username) {
        return res.status(400).json({
          message: 'Both project ID and username are required.',
        });
      }
      const userID = req.user?.id;
      if (!userID) {
        return res.status(401).json({
          message: 'Unauthorized: User ID is missing.',
        });
      }
      const existingProjectProvider = await ProjectProvider.findOne({
        project_id,
        userID  // Use the authenticated user's ID
      });
      if (existingProjectProvider) {
        return res.status(409).json({
          message: 'You have already applied to this project'
        });
      }
      const applied = new ProjectProvider({
        project_id,
        username,
        userID
      });
      const appliedProject = await applied.save();
      res.status(201).json({
        message: 'You have successfully applied to the project.',
        appliedProject,
      });
    } catch (error) {
      if (error.message === 'Invalid project ID format') {
        return res.status(400).json({
          message: 'Invalid project ID format'
        });
      }
      this.handleError(res, error, 'Error while applying to the project');
    }
  };
  static getProjectByUsername = async (req, res) => {
    try {
      const { username } = req.params;
      if (!username) {
        return res.status(400).json({ message: "Username is required", projects: [] });
      }
      
      const projects = await ProjectProvider.find({ username })
        .populate({
          path: 'project_id',
          model: 'Project'
        });
    
      return res.status(200).json({
        message: `Projects of ${username}`,
        projects: projects
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: `Error while fetching projects for ${username}`,
        projects: []
      });
    }
  };
  static getProjectProviders = async (req, res) => {
    try {
      const { projectId } = req.params;
      
      this.validateId(projectId);
  
      const providers = await ProjectProvider.find({ project_id: projectId })
        .select('username')
        .lean();
  
      return res.status(200).json({
        message: 'Project providers retrieved successfully',
        providers
      });
    } catch (error) {
      return this.handleError(
        res, 
        error, 
        'Error retrieving project providers'
      );
    }
  };
}

module.exports=ProjectProviderControl;