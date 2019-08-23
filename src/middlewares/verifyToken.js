/* eslint-disable valid-jsdoc */
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import models from '../models/User';

dotenv.config();
const { User } = models;

/**
 * verify token
 * @param {object} req
 * @param {object} res
 * @param {object} next
 */
export default async function verifyToken(req, res, next) {
  const token = req.body.token || req.header('x-auth-token');
  if (!token) {
    return res
      .status(400)
      .json({ status: 'error', error: 'No token Provided' });
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    const user = await User.findOne({ where: { id: decoded.id, } });
    if (!user) {
      return res
        .status(400)
        .json({ status: 'error', error: 'Invalid Token' });
    }

    req.body.userId = decoded.id;
    next();
  } catch (err) {
    if (err) {
      return res
        .status(500)
        .json({ status: 'error', error: err.message });
    }          
  }
}
