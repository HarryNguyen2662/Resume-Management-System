const express = require('express');
const resumeController = require('../../controllers/resume.controller');

const router = express.Router();

router.route('/').post(resumeController.createResume).get(resumeController.getResumeAll);

router.route('/:resumeId').get(resumeController.getResumeById).delete(resumeController.deleteResume);

router.route('/resumepage/:page/:limit').get(resumeController.getResumeByPage);

module.exports = router;
