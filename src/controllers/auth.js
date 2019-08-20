import { InvalidToken } from '../database/models';

export class AuthController {
   /**
    * 
    * @param {Request} req 
    * @param {Response} res
    */
  async logout(req, res) {
    const { token, user } = req;
    const invalidated = await InvalidToken.create({
      actual: token
    });
    if (invalidated) {
      const data = {
        message: `Successfully logged out user with email: ${user.email}`
      };
      res.status(200).json({
        status: 200,
        data
      });
    }
  }
}
