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
   */
  async checkToken(req, res, next) {
    const { authorization } = req.headers;
    if (!authorization) {
      res.status(400).json({
        status: 400,
        error: 'No authorization header present in request'
      });
      return;
    }
    const token = authorization.split(' ')[1];
    if (!token) {
      res.status(401).json({
        status: 401,
        error: 'Unable to authorize. Token not present in header'
      });
      return;
    }
    const payload = jwt.decode(token);
    const verified = await new Promise((resolve) => {
      jwt.verify(token, 'secret', null, (err, decoded) => {
        resolve(decoded);
      });
    });
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
        error: 'User is logged out'
      });
      return;
    }
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
