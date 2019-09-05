/* eslint-disable import/named */
/* eslint-disable require-jsdoc */
import models from '../models';

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
        role,
      } = req.body;

      let user = await User.findOne({ where: { email } });
      if (user === null) {
        return res.status(404).json({
          status: 'error',
          error: 'User does not exist'
        });
      }
      user = await user.update({ role }, { returning: true });
      user = user.dataValues;
      const newRole = user.role;

      return res.status(200).json({
        status: 'success',
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          email,
          role: newRole
        }
      });
    } catch (error) {
      return res.status(200).json({
        status: 'success',
        error: error.message
      });
    }
  }
}

export default roleController;
