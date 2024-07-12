const httpStatus = require('http-status');
const { oauth2Client, google } = require('../config/googledrive');
const ApiError = require('../utils/ApiError');
const fs = require('node:fs');
const { Readable } = require('node:stream');

async function findOrCreateFolder(folderName) {
  const drive = google.drive({ version: 'v3', auth: oauth2Client });

  // Search for the folder by name
  let pageToken = null;
  do {
    const response = await drive.files.list({
      q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`,
      spaces: 'drive',
      fields: 'nextPageToken, files(id, name)',
      pageToken: pageToken,
    });
    if (response.data.files.length) {
      // Folder exists, return its ID
      return response.data.files[0].id;
    }
    pageToken = response.nextPageToken;
  } while (pageToken);

  // Folder doesn't exist, create it
  const fileMetadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
  };
  const folder = await drive.files.create({
    resource: fileMetadata,
    fields: 'id',
  });

  return folder.data.id; // Return the new folder's ID
}

async function UploadResumePDF(file) {
  if (!file) {
    console.log('No file uploaded');
    return;
  }

  // Find or create the folder and get its ID
  const folderId = await findOrCreateFolder('CoderPushresume');

  const drive = google.drive({
    version: 'v3',
    auth: oauth2Client,
  });

  const bufferStream = new Readable({
    read() {
      this.push(file.buffer);
      this.push(null); // End of stream
    },
  });

  const res = await drive.files.create({
    requestBody: {
      name: file.originalname || 'default_name.pdf',
      mimeType: 'application/pdf',
      parents: [folderId], // Use the folder ID here
    },
    media: {
      mimeType: 'application/pdf',
      body: bufferStream,
    },
  });
  return res;
}

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
