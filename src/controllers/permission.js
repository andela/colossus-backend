/* eslint-disable import/named */
/* eslint-disable require-jsdoc */
import models from '../models';
import errorResponse from '../utils/index';

const { permission } = models;

class permissionController {
  /**
   * @param {object} req request object
   * @param {object} res response object
   * @returns {object} success or error response
   * @description assigns permissions to roles for a particular resource endpoint
   */
  static async assignPermission(req, res) {
    try {
      const { roleId } = req.params;
      const { resourceId, ...actions } = req.body;

      const rolePermission = await permission.findOne({
        where: {
          roleId, resourceId
        }
      });
      let assignedPermissions;
      if (!rolePermission) {
        assignedPermissions = await permission.create({
          roleId, resourceId, ...actions
        });
        return res.status(200).json({
          status: 'success',
          data: assignedPermissions.dataValues
        });
      }
      assignedPermissions = await permission.update({ ...actions }, {
        returning: true,
        where: {
          roleId, resourceId
        }
      });
      return res.status(200).json({
        status: 'success',
        data: assignedPermissions.dataValues
      });
    } catch (error) {
      return errorResponse(error.message, res, 500);
    }
  }
}

export default permissionController;
