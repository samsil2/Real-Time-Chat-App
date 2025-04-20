/**
 * Cloudinary SDK configuration module.
 *
 * Loads environment variables and initializes the Cloudinary client
 * for handling image and media uploads throughout the application.
 *
 * @module config/cloudinary
 */

import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";

// Load .env variables into process.env
config();

// Initialize Cloudinary with credentials from environment
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Your Cloudinary cloud name
  api_key:    process.env.CLOUDINARY_API_KEY,    // Your Cloudinary API key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Your Cloudinary API secret
});

// Export the configured Cloudinary instance for use in service layers
export default cloudinary;
