// uploadImage.js
const cloudinary = require('./cloudinaryConfig');
const { Readable } = require('stream');

const uploadImage = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'BlogCoverImages', // Specify the folder name here
        resource_type: 'image', // Ensure the resource type is image
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );

    Readable.from(file.buffer).pipe(uploadStream);
  });
};

module.exports = uploadImage;
