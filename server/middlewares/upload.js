// server/middlewares/upload.js
import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

import cloudinary from '../config/cloudinaryConfig.js'

if (cloudinary?.default) cloudinary = cloudinary.default;
if (cloudinary?.v2) cloudinary = cloudinary.v2;


const storage = new CloudinaryStorage({
  cloudinary, // <-- now guaranteed to be the real instance
  params: {
    folder: 'UserPins',
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf', 'doc', 'docx'],
    resource_type: 'auto', // supports images + PDFs/docs
  },
});
const upload = multer({ storage });
export default upload;