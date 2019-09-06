import Helpers from '../helpers/Helpers';

const { extractErrors } = Helpers;

/**
 * @export
 * @class RoleInputValidator
 * @param {callback} next
 * @description validates /role endpoint
 */
export default class RoleInputValidator {
  /**
   * @static
   * @param {object} req - The request entered by the user.
   * @param {object} res  - The response sent to the user is error if validation fails
   * @param {callback} next - The next middleware is called if validation is successful
   * @returns {object} The response
   * @memberof RoleInputValidator
   */
  static validateRole(req, res, next) {
    req
      .check('email', 'Email is required')
      .notEmpty()
      .isEmail()
      .trim()
      .withMessage('Invalid email');
    req
      .check('role', 'Role is required')
      .notEmpty()
      .trim()
      .isIn([
        'super_admin',
        'travel_admin',
        'travel_team_member',
        'manager',
        'requester',
        'supplier',
        'user'
      ])
      .withMessage('Specified role does not exist');

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
