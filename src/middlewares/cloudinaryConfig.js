import { config } from 'cloudinary';

/**
 * @description makes cloudinary configuration available
 */
export default class CloudinaryConfig {
  /**
   * @param {Request} req
   * @param {Response} res
   * @param {Response} next
   * @returns {next} next middleware
   */
  static async cloudinaryConfig(req, res, next) {
    config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    return next();
  }
}
