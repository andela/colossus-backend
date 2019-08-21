import jwt from 'jsonwebtoken';
import { User, InvalidToken } from '../database/models';

/**
 * Performs auth related operations on incoming requests
 */
export class Auth {
  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @param {*} next
   * @returns {Promise<void>} any
   *
   */
  static async checkToken(req, res, next) {
    // Get auth header
    const { authorization } = req.headers;
    if (!authorization) {
      res.status(400).json({
        status: 400,
        error: 'No authorization header present in request'
      });
      return;
    }
    // Retrieve token
    const token = authorization.split(' ')[1];
    if (!token) {
      res.status(401).json({
        status: 401,
        error: 'Unable to authorize. Token not present in header'
      });
      return;
    }
    // Get payload from token
    const payload = jwt.decode(token);
    // Check if token is valid
    const verified = await new Promise((resolve) => {
      jwt.verify(token, 'secret', null, (err, decoded) => {
        resolve(decoded);
      });
    });
    // Confirm user has not signed out thus needing a new token
    const isInvalid = await new Promise((resolve) => {
      InvalidToken.findByActual(token).then((value) => {
        resolve(value);
      });
    });
    if (!verified) {
      res.status(401).json({
        status: 401,
        error: 'Unauthorized. Token is invalid'
      });
      return;
    }
    if (isInvalid) {
      res.status(401).json({
        status: 401,
        error: 'You need to sign in to be able to access this resource'
      });
      return;
    }
    // Get user from payload
    const user = await new Promise((resolve) => {
      User.findByPk(payload.id).then((u) => {
        resolve(u);
      });
    });
    if (user) {
      req.user = user;
      req.token = token;
      next();
    } else {
      res.status(401).json({
        status: 401,
        error: 'Unauthorized. User not recognized'
      });
    }
  }
}
