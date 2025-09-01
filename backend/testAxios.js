require("dotenv").config();
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

async function upload() {
  const form = new FormData();
  form.append("file", fs.createReadStream("test.png")); // path to a real file
  form.append("upload_preset", "ml_default"); // Cloudinary creates this by default in new accounts

  try {
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      form,
      { headers: form.getHeaders() }
    );
    console.log("✅ Success:", res.data.secure_url);
  } catch (err) {
  if (err.response) {
    console.error("❌ Error response:", err.response.status, err.response.data);
  } else if (err.request) {
    console.error("❌ No response received:", err.request);
  } else {
    console.error("❌ Error setting up request:", err.message);
  }
}
}

upload();
