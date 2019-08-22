/* eslint-disable require-jsdoc */
import jwt from 'jsonwebtoken';
import { compareSync } from 'bcryptjs';
// eslint-disable-next-line import/named
import { generateToken, decodeToken } from '../helpers/jwtHelper';
import CommonHelper from '../helpers/commonHelper';
import sendVerificationMail from '../services/email';

import models from '../models';
import errorResponse from '../utils/index';
import { generateToken } from '../helpers/jwtHelper';
import sendVerificationMail from '../services/email';
import CommonHelper from '../helpers/commonHelper';

const UserModel = models.User;

class AuthController extends CommonHelper {
  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} the new user
   * @description register a new client
   */
  static async signUp(req, res) {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
      } = req.body;

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

        const payload = {
          email, password
        };
        const token = generateToken(payload);
        const location = process.env.FRONTEND_URL;
        const url = '/verifyuser';
        const link = AuthController.generateEmailLink(location, url, token);
        const message = `
          <p>Thank you for registering. Please Click the link below to verify your Barefoot Nomad account</p>&nbsp;
          <strong>
            <a href=${link}>Link</a>
          </strong>
         `;
        await sendVerificationMail(email, 'Verify Your Email', message);

        return res.header('x-auth-token', token).status(201).json({
          status: 201,
          data: {
            id: newUser.id,
            token,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
          },
        });
      }
    } catch (error) {
      return res.status(500).json({ status: 500, error });
    }
  }

  static async signIn(req, res) {
    try {
      const {
        email,
        password,
      } = req.body;
      let user = await UserModel.findOne({ where: { email, } });
      // Check if the user does not exist
      if (!user) {
        return res.status(400).json({ status: 400, error: 'Unauthorized', });
      }
      user = user.dataValues;
      // Check if the password matches with the user's password in the db
      if (!compareSync(password, user.password)) {
        return res.status(400).json({ status: 400, error: 'Unauthorized', });
      }
      // Generate JWT
      const token = jwt.sign({ id: user.id, email, }, process.env.JWT_SECRET, { expiresIn: '50h' });
      return res.status(200).json({
        status: 200,
        data: {
          id: user.id,
          token,
          firstName: user.firstName,
          lastName: user.lastName,
          email,
        },
      });
    } catch (error) {
      return res.status(500).json({ status: 500, error });
  /**
   * @param {*} req new unverified client
   * @param {*} res success or error object
   * @returns {object} a verified client
   * @description check that client is an actual user
   */
  static async verifyUser(req, res) {
    const { query } = req.query;
    try {
      const decoded = decodeToken(query);

      const user = await UserModel.findOne({ where: { email: decoded.email } });
      user.update({ isVerified: true });
      const payload = { user };
      delete payload.password;
      const newToken = generateToken(payload);

      return res.status(200).json({
        status: 'success',
        message: 'Client successfully verified',
        token: newToken
      });
    } catch (err) {
      res.status(500).json({ status: 'error', error: err.message });
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
