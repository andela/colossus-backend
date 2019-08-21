/* eslint-disable require-jsdoc */
import jwt from 'jsonwebtoken';
import { InvalidToken, User } from '../database/models';

export default class AuthController {
  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @returns {void}
   */
  static async signUp(req, res) {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
      } = req.body;
        // Check if the email already exists
      const user = await User.findOne({
        where: {
          email
        }
      });
      if (user) {
        res.status(400).json({
          status: 400,
          error: 'Email already exists'
        });
      } else {
        // Password hash occurs in the hook beforeSave
        const newUser = await User.create({
          firstName,
          lastName,
          email,
          password,
        });
          // Generate JWT
        const token = jwt.sign({ id: newUser.id, email },
          process.env.JWT_SECRET,
          {
            expiresIn: '50h'
          });
        res.status(201).json({
          status: 201,
          data: {
            id: newUser.id,
            token,
            firstName,
            lastName,
            email,
          },
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        error
      });
    }
  }

  /**
    *
    * @param {Request} req
    * @param {Response} res
    * @returns {void}
    */
  static async logout(req, res) {
    try {
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
    } catch (error) {
      res.status(500).json({
        status: 500,
        error
      });
    }
  }
}
