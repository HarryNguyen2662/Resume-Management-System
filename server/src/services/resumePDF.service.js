const httpStatus = require('http-status');
const { ResumePDF } = require('../models');
const ApiError = require('../utils/ApiError');

// service to upload a pdf file
const UploadResumePDF = async (pdfFile) => {
  const { originalname, buffer, mimetype } = pdfFile;
  const file = new ResumePDF({
    name: originalname,
    data: buffer,
    contentType: mimetype,
  });
  await file.save();
  return file;
};

// service to display a list of uploaded files
const GetResumePDFList = async () => {
  const files = await ResumePDF.find();
  return files;
};

// service to display an individual file based on its ID
const GetResumePDFById = async (id) => {
  const file = await ResumePDF.findById(id);
  if (!file) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Can not get resume pdf file because of invalid id');
  }
  return file;
};

// service to delete an individual file based on its ID
const DeleteResumePDFById = async (id) => {
  const file = await ResumePDF.findByIdAndDelete(id);
  if (!file) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Can not delete resume pdf file because of invalid id');
  }
  return file;
};

const GetResumePDFbyPage = async (options) => {
  page = Number.parseInt(options.page);
  limit = Number.parseInt(options.limit);
  //const files = await ResumePDF.paginate({}, options);
  const totalCount = await ResumePDF.countDocuments({});
  const totalPages = Math.ceil(totalCount / limit);
  const skip = (page - 1) * limit;

  const files = await ResumePDF.find({}).skip(skip).limit(limit).exec();

  return {
    files,
    currentPage: page,
    totalPages,
    totalCount,
  };
  //return files;
};

module.exports = {
  UploadResumePDF,
  GetResumePDFById,
  GetResumePDFList,
  DeleteResumePDFById,
  GetResumePDFbyPage,
};
