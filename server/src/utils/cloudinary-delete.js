const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

const DeleteOnCloudinary = (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, { resource_type: 'raw' }, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
    //streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

module.exports = DeleteOnCloudinary;
