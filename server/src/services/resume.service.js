// resume.service.js

const httpStatus = require('http-status');
const { Resume } = require('../models');
const ApiError = require('../utils/ApiError');
const http = require('node:https');

/**
 * Create or update a resume
 * @param {ObjectId} resumeBody
 * @returns {Promise<Resume>}
 */
const createResume = async (resumeBody) => {
  return Resume.create(resumeBody);
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
  const resume = await Resume.findById(resumeId);
  if (!resume) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Can not get resume because of invalid id');
  }
  return resume;
};

/**
 * Delete a resume by ID
 * @param {ObjectId} resumeId
 * @returns {Promise<Resume>}
 */
const deleteResumeById = async (resumeId) => {
  const resume = await Resume.findByIdAndDelete(resumeId);
  if (!resume) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Can not delete resume because of invalid id');
  }
  return resume;
};

/**
 * Get resume by page
 * @param {number} page
 * @param {number} limit
 * @returns {Promise<Resume>}
 */
const getResumeListbyPage = async (options) => {
  page = Number.parseInt(options.page);
  limit = Number.parseInt(options.limit);
  const totalCount = await Resume.countDocuments({});
  const totalPages = Math.ceil(totalCount / limit);
  const skip = (page - 1) * limit;

  const resume = await Resume.find({}).skip(skip).limit(limit).exec();
  return {
    files,
    currentPage: page,
    totalPages,
    totalCount,
  };
};

module.exports = {
  createResume,
  getResumeById,
  deleteResumeById,
  getResumeAll,
  getResumeListbyPage,
};
