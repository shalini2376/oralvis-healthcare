require("dotenv").config();
const cloudinary = require("cloudinary").v2;

// Configure using .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// console.log("Cloudinary config:", cloudinary.config());
async function testUpload() {
  try {
    const result = await cloudinary.uploader.upload("real.png", {
      folder: "oralvis_uploads", // optional folder in your Cloudinary account
    });
    console.log("✅ Upload successful:", result.secure_url);
  } catch (err) {
    console.error("❌ Upload failed:", err);
  }
}

testUpload();
