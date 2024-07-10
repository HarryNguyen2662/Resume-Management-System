const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');
const { resumeService } = require('../services');

const createResume = catchAsync(async (req, res) => {
  try {
    result = await resumeService.createResume(req);
    res.status(httpStatus.CREATED).send({
      message: 'File and data received.',
      resume: result,
    });
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid request');
  }
});

const updateResumeById = catchAsync(async (req, res) => {
  const updateData = req.body;
  const updatedResume = await resumeService.updateResumeById(req.params.resumeId, updateData);
  res.send({
    message: 'Resume updated successfully',
    resume: updatedResume,
  });
});

const getResumeAll = catchAsync(async (req, res) => {
  const resumes = await resumeService.getResumeAll();
  res.send(resumes);
});

const getResumeById = catchAsync(async (req, res) => {
  const resume = await resumeService.getResumeById(req.params.resumeId);
  if (!resume) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid ID');
  }
  res.send(resume);
});

const deleteResume = catchAsync(async (req, res) => {
  await resumeService.deleteResumeById(req.params.resumeId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getResumeByPage = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const resume = await resumeService.getResumeListbyPage(options);
  res.send(resume);
});

const getResumesByKeywords = catchAsync(async (req, res) => {
  const params = pick(req.query, ['limit', 'page']);
  const keywords = pick(req.query, ['keywords'])
    .keywords.split(',')
    .map((k) => k.trim())
    .filter(Boolean);

  const page = params.page;
  const limit = params.limit;
  const options = {
    skip: (page - 1) * limit,
    limit: parseInt(limit, 10),
  };

  if (!Array.isArray(keywords) || keywords.length === 0) {
    return res.status(400).send('Keywords must be a non-empty array');
  }

  const resumes = await resumeService.getResumesByKeywords(options, keywords);

  res.send(resumes);
});

module.exports = {
  createResume,
  getResumeAll,
  getResumeById,
  deleteResume,
  getResumeByPage,
  updateResumeById,
  getResumesByKeywords,
};
