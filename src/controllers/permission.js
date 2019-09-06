/* eslint-disable import/named */
/* eslint-disable require-jsdoc */
import models from '../models';

const { Permission } = models;

class PermissionController {
  /**
   * @param {object} req request object
   * @param {object} res response object
   * @returns {object} success or error response
   * @description assigns permissions to roles for a particular resource endpoint
   */
  static async assignPermission(req, res) {
    try {
      const { role, resource, ...actions } = req.body;
      const rolePermission = await Permission.findOne({
        where: {
          role, resource
        }
      });
      if (!rolePermission) {
        return res.status(404).json({
          status: 'error',
          error: 'Cannot assign permission to a non-existing resource'
        });
      }
      const assignedPermissions = await rolePermission.update({ ...actions }, {
        where: {
          role, resource
        }
      });
      return res.status(200).json({
        status: 'success2',
        data: assignedPermissions.dataValues
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        error: error.message
      });
    }
  }
}

export default PermissionController;
