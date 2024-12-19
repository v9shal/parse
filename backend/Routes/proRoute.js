const express =require("express");
const ProjectController =require('../controllers/projectController') 
const router =express.Router();
const authenticateToken =require('../middleware/authMiddleware')
router.post('/addProject',authenticateToken,ProjectController.addProject)
router.post('/getAllProject',ProjectController.getAllProjects)
router.post('/deleleProject',ProjectController.deleteProject)
router.post('/updateProject',ProjectController.updateProject)
router.get("/getProjectByTitle/:projectTitle", ProjectController.getProjectByTitle);

router.get('/getProject/:projectId', ProjectController.getProject);
router.get('/getProjectByusername/:username',authenticateToken,ProjectController.getProjectByusername)

module.exports = router;