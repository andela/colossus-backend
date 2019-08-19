import { InvalidTokenModel } from '../database/config';

/**
 * This class contains methods that handle authentications
 */
export class AuthController {
  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @returns {void}
   */
  async logout(req, res) {
    try {
      const { token, user } = req;
      const value = await InvalidTokenModel.create({
        actual: token
      });
      if (value) {
        const data = {
          message: 'Successfully signed user out',
          user,
          value
        };
        res.status(200).json({
          status: 200,
          data
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        error
      });
    }
  }
}
