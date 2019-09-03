/* eslint-disable import/named */
/* eslint-disable require-jsdoc */
import models from '../models';
import errorResponse from '../utils/index';

const { User } = models;

class roleController {
  /**
   * @param {object} req request object
   * @param {object} res response object
   * @returns {object} success or error response
   * @description assigns a role to users
   */
  static async assignRole(req, res) {
    try {
      const {
        email,
        roleId,
      } = req.body;

      let user = await User.findOne({ where: { email } });
      if (!user) {
        return errorResponse('User does not exist', res, 400);
      }
      user = await User.update({ roleId }, { returning: true });
      user = user.dataValues;
      const { password, ...userWithoutPassword } = user;

      return res.status(200).json({
        status: 200,
        data: userWithoutPassword
      });
    } catch (error) {
      return errorResponse(error.message, res, 500);
    }
  }
}

export default roleController;
