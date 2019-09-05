import Helpers from '../helpers/Helpers';

const { extractErrors } = Helpers;

/**
 * @export
 * @class PermissionsValidator
 * @param {callback} next
 * @description validates /role/pemissions endpoint
 */
export default class PermissionsValidator {
  /**
   * @static
   * @param {object} req - The request entered by the user.
   * @param {object} res  - The response sent to the user is error if validation fails
   * @param {callback} next - The next middleware is called if validation is successful
   * @returns {object} The response
   * @memberof PermissionsValidator
   */
  static validatepermission(req, res, next) {
    const { role, resource, ...permissions } = req.body;
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
    req
      .check('resource', 'Resource endpoint must be specified')
      .notEmpty()
      .trim();
    if ('create' in permissions && typeof permissions.create !== 'boolean') {
      req
        .check('create', 'create must be a boolean')
        .trim()
        .isIn([true, false]);
    }
    if ('read' in permissions && typeof permissions.read !== 'boolean') {
      req
        .check('read', 'read must be a boolean')
        .trim()
        .isIn([true, false]);
    }
    if ('update' in permissions && typeof permissions.update !== 'boolean') {
      req
        .check('update', 'update must be a boolean')
        .trim()
        .isIn([true, false]);
    }
    if ('delete' in permissions && typeof permissions.delete !== 'boolean') {
      req
        .check('delete', 'delete must be a boolean')
        .trim()
        .isIn([true, false]);
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
