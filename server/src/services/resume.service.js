// resume.service.js

const httpStatus = require('http-status');
const { Resume } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create or update a resume
 * @param {ObjectId} resumeId
 * @param {Object} resumeData
 * @returns {Promise<Resume>}
 */
const createResume = async (resumeId, resumeData) => {
  const existingResume = await Resume.findOne({ resume: resumeId });
  if (existingResume) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Resume already exists');
  }
  const resume = await Resume.create(resumeData);
  return resume;
};

/**
 * Get all resume
 * @returns {Promise<Resume>}
 */
const getResumeAll = async () => {
  const resume = await Resume.find();
  return resume;
};

/**
 * Get a resume by ID
 * @param {ObjectId} resumeId
 * @returns {Promise<Resume>}
 */
const getResumeById = async (resumeId) => {
  const resume = await Resume.findOne({ resume: resumeId });
  if (!resume) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resume not found');
  }
  return resume;
};

/**
 * Delete a resume by ID
 * @param {ObjectId} resumeId
 * @returns {Promise<Resume>}
 */
const deleteResumeById = async (resumeId) => {
  const resume = await Resume.findOneAndDelete({ user: resumeId });
  if (!resume) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resume not found');
  }
  return resume;
};

/**
 * Get resume by page
 * @param {number} page
 * @param {number} limit
 * @returns {Promise<Resume>}
 */
const getResumeListbyPage = async (page, limit) => {
  const resume = await Resume.find()
    .limit(limit)
    .skip(limit * page);
  return resume;
};

module.exports = {
  createResume,
  getResumeById,
  deleteResumeById,
  getResumeAll,
  getResumeListbyPage,
};
