const httpStatus = require('http-status');
const { resumePDFService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');

// POST /upload - Upload a PDF file
const uploadResumePDF = catchAsync(async (req, res) => {
  try {
    result = await resumePDFService.UploadResumePDF(req.file);
    res.send(result);
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid request');
  }
});

// GET /files - List all uploaded PDF files
const getResumeByList = catchAsync(async (req, res) => {
  try {
    const files = await resumePDFService.GetResumePDFList();
    res.send(files);
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid request');
  }
});

// GET /file/:id - Get a PDF file by its ID
const getResumeById = catchAsync(async (req, res) => {
  try {
    const file = await resumePDFService.GetResumePDFById(req.params.id);
    if (!file) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Can not get resume pdf file because of invalid id');
    }
    res.contentType(file.contentType);
    res.send(file.data);
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.BAD_REQUEST, 'Can not get resume pdf file because of bad request');
  }
});

// DELETE /file/:id - Delete a PDF file
const deleteResumeById = catchAsync(async (req, res) => {
  try {
    const file = await resumePDFService.DeleteResumePDFById(req.params.id);
    if (!file) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Can not delete resume pdf file because of invalid id');
    }
    res.send(file);
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.BAD_REQUEST, 'Can not delete resume pdf file because of bad request');
  }
});

const getResumeBypage = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await resumePDFService.GetResumePDFbyPage(options);
  res.send(result);
});

module.exports = {
  uploadResumePDF,
  getResumeByList,
  getResumeById,
  deleteResumeById,
  getResumeBypage,
};
