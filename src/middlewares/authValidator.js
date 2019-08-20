import Helpers from '../helpers/Helpers';

const { extractErrors } = Helpers;


export default class AuthValidator {
  /**
   *
   *
   * @static
   * @param {object} req
   * @param {object} res
   * @param {callback} next
   * @returns {number} The sum of the two numbers.
   * @memberof AuthValidator
   */
  static validateSignUp(req, res, next) {
    req
      .check('email', 'Email is required')
      .notEmpty()
      .isEmail()
      .withMessage('Invalid email');
    req
      .check('first_name', 'First Name is required')
      .notEmpty()
      .trim();
    req
      .check('last_name', 'Last Name is required')
      .notEmpty()
      .trim();
    req
      .check('password', 'Password is required')
      .notEmpty()
      .trim()
      .isLength({ min: 6 })
      .withMessage('password cannot be less then 6 characters');
    req
      .check('phone_number', 'The phone number is required')
      .notEmpty()
      .trim()
      .isLength({ min: 11 })
      .withMessage('Enter a valid phone number');
    req
      .check('address', 'Address is required')
      .notEmpty()
      .trim()
      .isLength({ min: 11 })
      .withMessage('Invalid address');

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
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   * @memberof AuthValidator
   */
  static validateLogin(req, res, next) {
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
