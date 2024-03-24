import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
dotenv.config({ path: "./.env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async function (localFilePath) {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    //file uploaded successfully
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    // remove the locally saved temporary file as the upload operation got failed
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const deleteFileOnCloudinary = async (secureUrl) => {
  try {
    if (!secureUrl) return null;
    //Extracting public_id from the secure_url

    const publicId = secureUrl.match(/\/([^/]+?)\.([^/]+?)$/)[1];
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw error;
  }
};

export { uploadOnCloudinary, deleteFileOnCloudinary };
