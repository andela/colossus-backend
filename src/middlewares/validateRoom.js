import Helpers from '../helpers/Helpers';

const { extractErrors } = Helpers;

/**
 * @export
 * @class RoomValidator
 * @param {callback} next
 * @description validates room endpoint(s)
 */
export default class RoomValidator {
  /**
   * @static
   * @param {object} req - The request entered by the user.
   * @param {object} res  - The response sent to the user is error if validation fails
   * @param {callback} next - The next middleware is called if validation is successful
   * @returns {object} The response
   * @memberof RoomValidator
   */
  static validateRoom(req, res, next) {
    req
      .check('name', 'Name of accommodation is required')
      .notEmpty()
      .trim();
    req
      .check('type', 'Type of accommodation is required')
      .notEmpty()
      .trim();

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
