const ProjectProviderControl =require('../controllers/projectProviderController')
const express =require( 'express')
const authenticateToken =require('../middleware/authMiddleware')
const router=express.Router();

router.post('/apply/project',authenticateToken,ProjectProviderControl.applyToProject);
router.get('/getProjects/:username',authenticateToken,ProjectProviderControl.getProjectByUsername);
router.get('/project/:projectId/providers', authenticateToken, ProjectProviderControl.getProjectProviders);
router.get('/getpro/:username',authenticateToken,ProjectProviderControl.getProjectByUsername);
router.get('/getPendingProvider/:projectId',authenticateToken,ProjectProviderControl.getPendingProvider);
router.put('/updateStatusProvide/:projectId/:username',authenticateToken,ProjectProviderControl.updateStatusProvider);
module.exports=router;