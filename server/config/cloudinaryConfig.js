// server/config/cloudinaryConfig.js
import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// resolve absolute path to config.env
dotenv.config({ path: path.join(__dirname, 'config.env') })

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

console.log('ENV cloud name:', process.env.CLOUDINARY_CLOUD_NAME)

export default cloudinary