import Helpers from '../helpers/Helpers';

const { extractErrors } = Helpers;


/**
 *
 * validates user sign up inputs
 *
 * @export
 * @class AuthValidator
 * @param {callback} next
 */
export default class AuthValidator {
  /**
   *
   *
   * @static
   * @param {object} req - The request entered by the user.
   * @param {object} res  - The response sent to the user is error if validation fails
   * @param {callback} next - The next middleware is called if validation is successful
   * @returns {object} The response
   * @memberof AuthValidator
   */
  static validateSignUp(req, res, next) {
    req
      .check('email', 'Email is required')
      .notEmpty()
      .isEmail()
      .withMessage('Invalid email');
    req
      .check('firstName', 'First Name is required')
      .notEmpty()
      .trim();
    req
      .check('lastName', 'Last Name is required')
      .notEmpty()
      .trim();
    req
      .check('password', 'Password is required')
      .notEmpty()
      .trim()
      .isLength({ min: 8 })
      .withMessage('password cannot be less then 8 characters')
      .isAlphanumeric()
      .withMessage('Password must be alphanumeric');

    const errors = req.validationErrors();
    if (errors) {
      return res.status(400).json({
        status: 'error',
        error: extractErrors(errors),
      });
    }
    return next();
  }


  /**
   *
   *
   * @static
   * @param {object} req - The request entered by the user.
   * @param {object} res  - The response sent to the user is error if validation fails
   * @param {callback} next - The next middleware is called if validation is successful
   * @returns {number} The response
   * @memberof AuthValidator
   */
  static validateSignIn(req, res, next) {
    req
      .check('email', 'Email is required')
      .notEmpty()
      .isEmail()
      .trim()
      .withMessage('Invalid email');
    req
      .check('password', 'Password is required')
      .notEmpty()
      .trim();

    const errors = req.validationErrors();
    if (errors) {
      return res.status(400).json({
        status: 'error',
        errors: extractErrors(errors),
      });
    }
    return next();
  }
}
