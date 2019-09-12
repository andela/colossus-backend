import { uploader } from 'cloudinary';
import bufferToString from '../helpers/bufferToString';


/**
 * @description checks if the file uploaded is a valid image file
 */
export default class ValidateImage {
  /**
   * @param {Request} req
   * @param {Response} res
   * @param {Response} next
   * @returns {next} next middleware
   */
  static async imageHandler(req, res, next) {
    try {
      if (req.file && req.file.mimetype.startsWith('image/')) {
        if (req.file) {
          const file = await bufferToString(req).content;
          const result = await uploader.upload(file);
          req.body.image = result.url;
        }
      }
      return next();
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        error: error.message
      });
    }
  }
}
