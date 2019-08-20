import jwt from 'jsonwebtoken';
import { User, InvalidToken } from '../database/models';

/**
 * Performs auth related operations on incoming requests
 */
export default class Auth {
  /**
   * 
   * @param {Request} req 
   * @param {Response} res 
   * @param {*} next 
   */
  async checkToken(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];
    const payload = jwt.decode(token);
    const verified = await new Promise((resolve, reject) => {
      jwt.verify(token, 'secret', null, (err, decoded) => {
        if (err) reject(err);
        resolve(decoded);
      });
    });
    const isInvalid = await new Promise((resolve, reject) => {
      InvalidToken.findByActual(token).then((value) => {
        resolve(value);
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
        error: 'Unauthorized. Token is invalid'
      });
      return;
    }
    if (isInvalid) {
      res.status(401).json({
        status: 400,
        error: 'User is logged out'
      });
      return;
    }
    const user = await new Promise((resolve, reject) => {
      User.findByPk(payload.id).then((u) => {
        resolve(u);
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
        error: 'Unauthorized. User not recognized'
      });
    }
  }
} 
