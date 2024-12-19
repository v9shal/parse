const ProjectProviderControl =require('../controllers/projectProviderController')
const express =require( 'express')
const authenticateToken =require('../middleware/authMiddleware')
const router=express.Router();

router.post('/apply/project',authenticateToken,ProjectProviderControl.applyToProject);
router.get('/getProjects/:username',authenticateToken,ProjectProviderControl.getProjectByUsername);
router.get('/project/:projectId/providers', authenticateToken, ProjectProviderControl.getProjectProviders);
module.exports=router;