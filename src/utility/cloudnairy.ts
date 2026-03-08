import { v2 as cloudinary } from "cloudinary";
import { log } from "console";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})


const UploadOnCloudinary = async (localFilePath: string) => {
    try {
        if (!localFilePath) {
            return null;
        }
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })
        return response.url;
    } catch (error) {
        console.log("Cloudinary upload error", error)
        fs.unlinkSync(localFilePath)
        return null;
    }
}

export default UploadOnCloudinary;