const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// We need streamifier to turn Buffer -> stream
function uploadBufferToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

module.exports = uploadBufferToCloudinary;
