import Helpers from '../helpers/Helpers';

const { extractErrors } = Helpers;

/**
 * @export
 * @class AccomodationValidator
 * @param {callback} next
 * @description validates accomodation endpoint(s)
 */
export default class AccomodationValidator {
  /**
   * @static
   * @param {object} req - The request entered by the user.
   * @param {object} res  - The response sent to the user is error if validation fails
   * @param {callback} next - The next middleware is called if validation is successful
   * @returns {object} The response
   * @memberof AccomodationValidator
   */
  static validateAccommodation(req, res, next) {
    req
      .check('name', 'Name of accommodation is required')
      .notEmpty()
      .trim();
    req
      .check('location', 'Location of accommodation is required')
      .notEmpty()
      .trim();
    req
      .check('type', 'Type of accommodation is required')
      .notEmpty()
      .trim();
    req
      .check('totalNumberOfRooms', 'Specify the total number of rooms')
      .notEmpty()
      .trim();
    if (req.file && !req.file.mimetype.startsWith('image/')) {
      req
        .check('image', 'Invalid image type')
        .notEmpty()
        .trim();
    }

    const errors = req.validationErrors();
    if (errors) {
      return res.status(400).json({
        status: 'error',
        error: extractErrors(errors),
      });
    }
    return next();
  }
}
