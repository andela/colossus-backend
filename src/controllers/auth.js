/* eslint-disable require-jsdoc */
import jwt from 'jsonwebtoken';
import models from '../models';
import errorResponse from '../utils/index';
import { generateToken } from '../helpers/jwtHelper';
import sendVerificationMail from '../services/email';
import CommonHelper from '../helpers/commonHelper';

const UserModel = models.User;

class AuthController extends CommonHelper {
  static async signUp(req, res) {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
      } = req.body;
        // Check if the email already exists
      const user = await UserModel.findOne({ where: { email, } });
      if (user) {
        res.status(400).json({ status: 400, error: 'Email already exists', });
      } else {
        // Password hash occurs in the hook beforeSave
        const newUser = await UserModel.create({
          firstName,
          lastName,
          email,
          password,
        });
          // Generate JWT
        const token = jwt.sign({ id: newUser.id, email, }, process.env.JWT_SECRET, { expiresIn: '50h' });
        return res.status(201).json({
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
      return res.status(500).json({ status: 500, error });
    }
  }

  /**
   *
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} success response/error response
   * @description Send's a mail containing the password reset link
   */
  static async sendEmail(req, res) {
    const { email } = req.body;
    try {
      const user = await UserModel.findOne({ where: { email } });
      if (!user) return errorResponse(new Error('No User with the provided email'), res, 404);
      const subject = 'Password Reset';
      const payload = { email };
      const token = generateToken(payload);
      const link = AuthController.generateEmailLink(process.env.HOSTED_LINK, '/reset-password', token);
      const message = `<p>You're almost there. To finish resetting your password, 
      please click on this link <a href = '${link}'>Reset Password</a>.</p>`;
      await sendVerificationMail(email, subject, message);
      const response = 'A verification has been sent to your email. Kindly follow that link to reset your password';
      return res.status(200).json({
        status: 200,
        data: { message: response, token }
      });
    } catch (error) {
      return errorResponse(error, res, 500);
    }
  }

  /**
   *
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} success response/error response
   * @description Reset's the password of a registered user
   */
  static async resetPassword(req, res) {
    const { password } = req.body;
    const { email } = req;
    try {
      const userToUpdate = await UserModel.findOne({ where: { email } });
      await userToUpdate.update({ password });
      return res.status(200).json({
        status: 200,
        data: { message: 'Password reset successful' }
      });
    } catch (error) {
      return errorResponse(error, res, 500);
    }
  }
}

export default AuthController;
