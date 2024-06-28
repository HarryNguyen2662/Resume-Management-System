const express = require('express');
const resumeController = require('../../controllers/resume.controller');

const router = express.Router();

router.route('/').post(resumeController.createResume);
router.route('/').get(resumeController.getResumeAll);
router.route('/:resumeId').get(resumeController.getResumeById);
router.route('/:resumeId').delete(resumeController.deleteResume);
router.route('/resumepage').get(resumeController.getResumeByPage);
module.exports = router;
