const mongoose =require( 'mongoose');
const Project  =require('../models/ProSchema');

class ProjectController {
  static validateObjectId(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid project ID format');
    }
  }

  static handleError(res, error, defaultMessage = 'An error occurred') {
    console.error(error);
    return res.status(500).json({ 
      message: defaultMessage, 
      error: error.message 
    });
  }

  static async addProject(req, res) {
    try {
      const userId = req.user.id; // User ID from the decoded token
  
      const { 
        title, 
        description, 
        smallDescription, 
        status, 
        deadline, 
        skillsRequired ,
        username
      } = req.body;
  
      // Validation checks
      if (!title || !description || !smallDescription || !status) {
        return res.status(400).json({ message: 'Title, description, small description, and status are required' });
      }
  
      // Validate and parse deadline
      // let parsedDeadline;
      // if (deadline) {
      //   parsedDeadline = new Date(deadline);
      //   if (isNaN(parsedDeadline)) {
      //     return res.status(400).json({ message: 'Invalid deadline format' });
      //   }
      // }
  
      // Create and save the project
      const project = new Project({ 
        title, 
        description, 
        smallDescription, 
        status, 
        deadline, 
        skillsRequired,
        createdBy: username ,
      });
  
      const savedProject = await project.save();
  
      return res.status(201).json({
        message: `Project "${title}" saved successfully`,
        project: savedProject,
      });
    } catch (error) {
      console.error('Error while saving project:', error);
      return res.status(500).json({ message: 'Error while saving new project' });
    }
  }
  

  static async deleteProject(req, res) {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ 
          message: 'Project ID is required' 
        });
      }

      ProjectController.validateObjectId(id);

      const deletedProject = await Project.findByIdAndDelete(id);

      if (!deletedProject) {
        return res.status(404).json({ 
          message: 'Project not found' 
        });
      }

      return res.status(200).json({ 
        message: 'Project deleted successfully' 
      });
    } catch (error) {
      return ProjectController.handleError(
        res, 
        error, 
        'Error while deleting project'
      );
    }
  }

  static async getProject(req, res) {
    try {
        const { projectId } = req.params;  // Changed from 'id' to match route
        
        if (!projectId) {
            return res.status(400).json({
                message: 'Project ID is required'
            });
        }
        
        // Validate ObjectId if needed
        ProjectController.validateObjectId(projectId);
        
        const project = await Project.findById(projectId);
        
        if (!project) {
            return res.status(404).json({
                message: 'Project not found'
            });
        }
        
        return res.status(200).json({
            message: `Project found: ${projectId}`,
            project
        });
    } catch (error) {
        return ProjectController.handleError(
            res,
            error,
            'Error while finding project'
        );
    }
}
static async getProjectByTitle(req, res) {
  try {
    const { projectTitle } = req.params; // Use route params instead of body

    if (!projectTitle) {
      return res.status(400).json({ 
        message: 'Project title is required' 
      });
    }

    const project = await Project.findOne({ title: {$regex:projectTitle,$options:'i'} });

    if (!project) {
      return res.status(404).json({ 
        message: 'No project found with this title' 
      });
    }   

    return res.status(200).json({
      message: `Project found: ${projectTitle}`,
      project
    });
  } catch (error) {
    return ProjectController.handleError(
      res, 
      error, 
      'Error while finding project by title'
    );
  }
}

static async getProjectByusername(req, res) {
  try {
    const { username } = req.params;  // Destructure to get the username
    if (!username)
      return res.status(400).json({ message: "username is required" });

    const fetchedprojects = await Project.find({ createdBy:username });
    if (!fetchedprojects || fetchedprojects.length === 0) {
      return res.status(401).json({ message: "no available projects" });
    }

    return res.status(200).json({
      message: `fetched projects for ${username}`,
      fetchedprojects,
    });
  } catch (error) {
    return ProjectController.handleError(
      res,
      error,
      `error while finding project for ${username}`
    );
  }
}


  static async getAllProjects(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        sortBy = 'createdAt', 
        sortOrder = 'desc' 
      } = req.body;

      const pageNum = Math.max(1, Number(page));
      const limitNum = Math.min(100, Math.max(1, Number(limit)));
      const skip = (pageNum - 1) * limitNum;

      const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

      const [projects, total] = await Promise.all([
        Project.find()
          .sort(sortOptions)
          .skip(skip)
          .limit(limitNum),
        Project.countDocuments()
      ]);

      if (!projects.length) {
        return res.status(404).json({ 
          message: 'No projects found' 
        });
      }

      return res.status(200).json({
        message: 'Projects retrieved successfully',
        projects,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          pageSize: limitNum,
          totalProjects: total
        }
      });
    } catch (error) {
      return ProjectController.handleError(
        res, 
        error, 
        'Error retrieving projects'
      );
    }
  }

  static async updateProject(req, res) {
    try {
      const { 
        id, 
        title, 
        description, 
        smallDescription, 
        status, 
        deadline, 
        skillsRequired 
      } = req.body;

      if (!id) {
        return res.status(400).json({ 
          message: 'Project ID is required' 
        });
      }

      ProjectController.validateObjectId(id);

      // Validation for field lengths
      if (description && description.length > 1000) {
        return res.status(400).json({ 
          message: 'Description cannot exceed 1000 characters' 
        });
      }

      if (smallDescription && smallDescription.length > 500) {
        return res.status(400).json({ 
          message: 'Small description cannot exceed 500 characters' 
        });
      }

      // Validate deadline if provided
      let parsedDeadline;
      if (deadline) {
        parsedDeadline = new Date(deadline);
        if (isNaN(parsedDeadline)) {
          return res.status(400).json({ 
            message: 'Invalid deadline format' 
          });
        }
      }

      // Prepare update data
      const updateData = {};
      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (smallDescription) updateData.smallDescription = smallDescription;
      if (status) updateData.status = status;
      if (deadline) updateData.deadline = parsedDeadline;
      if (skillsRequired) updateData.skillsRequired = skillsRequired;

      // Perform update
      const project = await Project.findByIdAndUpdate(
        id, 
        updateData, 
        { 
          new: true,
          runValidators: true
        }
      );

      if (!project) {
        return res.status(404).json({ 
          message: 'Project not found' 
        });
      }

      return res.status(200).json({
        message: 'Project updated successfully',
        project
      });
    } catch (error) {
      return ProjectController.handleError(
        res, 
        error, 
        'Error updating project'
      );
    }
  }
}

module.exports=ProjectController
