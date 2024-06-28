const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { resumeService } = require('../services');

const createResume = catchAsync(async (req, res) => {
  const resume = await resumeService.createResume(req.body.resumeId, req.body);
  res.status(httpStatus.CREATED).send(resume);
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
  const result = await resumeService.getResumeListbyPage(options);
  res.send(result);
});

module.exports = {
  createResume,
  getResumeAll,
  getResumeById,
  deleteResume,
  getResumeByPage,
};
