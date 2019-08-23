/* eslint-disable import/named */
/* eslint-disable require-jsdoc */
import { compareSync } from 'bcryptjs';
import { generateToken, decodeToken } from '../helpers/jwtHelper';
import CommonHelper from '../helpers/commonHelper';
import sendVerificationMail from '../services/email';
import errorResponse from '../utils/index';

import models from '../models';

const { User, InvalidToken } = models;

const UserModel = User;
const InvalidTokenModel = InvalidToken;

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

      let user = await UserModel.findOne({ where: { email: decoded.email } });
      user.update({ isVerified: true });

      user = user.dataValues;
      const { id, email, isVerified } = user;
      const payload = { id, email, isVerified };
      const newToken = generateToken(payload);

      return res.status(200).json({
        status: 'success',
        message: 'successfully verified',
        token: newToken
      });
    } catch (err) {
      res.status(500).json({ status: 'error', error: err.message });
    }
  }

  /**
   * @param {*} req the client
   * @param {*} res error or success
   * @returns {void}
   * @description Login a registered && verified user
   */
  static async signIn(req, res) {
    try {
      const {
        email,
        password,
      } = req.body;

      let user = await UserModel.findOne({ where: { email, } });
      if (!user) {
        return res.status(400).json({ status: 400, error: 'Invalid credentials' });
      }
      user = user.dataValues;
      if (!compareSync(password, user.password)) {
        return res.status(400).json({ status: 400, error: 'Invalid password' });
      }

      const { id } = user;
      const payload = { id, email };
      const token = generateToken(payload);

      return res.status(200).json({
        status: 200,
        data: {
          id,
          token,
          firstName: user.firstName,
          lastName: user.lastName,
          email,
        },
      });
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

  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>} logs user out
   */
  static async logout(req, res) {
    const { token, user } = req;
    const invalidated = await InvalidTokenModel.create({
      actual: token
    });
    if (invalidated) {
      res.status(200).json({
        status: 200,
        data: `Successfully signed out user with email ${user.email}`
      });
    }
  }
}

export default AuthController;
