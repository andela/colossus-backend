import jwt from 'jsonwebtoken';
import { UserModel, InvalidTokenModel } from '../database/config';

/**
 * This class handles auth operations e.g token retrieval from headers
 * @author Kingsley Victor
 */
export class Auth {
  /**
   * Method checks for token in headers
   * @param {Request} req
   * @param {Response} res
   * @param {*} next
   * @returns {void}
   */
  async checkToken(req, res, next) {
    // Get auth headers
    const { authorization } = req.headers;
    // Extract token
    const token = authorization.split(' ')[1];
    // Verify token to know if it is expired. `verified` is undefined if token is invalid
    const verified = await new Promise((resolve, reject) => {
      jwt.verify(token, 'secret', null, (err, decoded) => {
        if (err) reject(err);
        resolve(decoded);
      });
    });
    // Decode token to retrieve payload object
    const decoded = jwt.decode(token);
    // Check if token has been rendered invalid on logging out
    const isInvalid = await new Promise((resolve, reject) => {
      InvalidTokenModel.findByActual(token).then((actual) => {
        resolve(actual);
      })
        .catch((err) => reject(err));
    });
    if (!token) {
      res.status(401).json({
        status: 401,
        error: 'Unable to authorize. Token not present in header'
      });
      return;
    }
    if (!verified) {
      res.status(401).json({
        status: 401,
        error: 'Invalid token'
      });
      return;
    }
    if (isInvalid) {
      res.status(401).json({
        status: 401,
        error: 'Invalid token'
      });
      return;
    }
    const user = await new Promise((resolve, reject) => {
      UserModel.findByPk(decoded.id).then((value) => {
        resolve(value);
      })
      .catch((err) => reject(err));
    });
    if (user) {
      req.user = user;
      req.token = token;
      next();
    } else {
      res.status(401).json({
        status: 401,
        error: 'User not recognized'
      });
    }
  }
}
