import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import model from '../models';

const { InvalidToken, User } = model;

dotenv.config();

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>} checks token in headers
 */
export const checkToken = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(400).json({
      status: 'error',
      error: 'Authorization header not present in request'
    });
    return;
  }
  const token = authorization.split(' ')[1];
  if (!token) {
    res.status(401).json({
      status: 'error',
      error: 'Unable to check for token in headers'
    });
    return;
  }
  const payload = jwt.decode(token, process.env.JWT_SECRET);
  const verified = await new Promise((resolve) => {
    jwt.verify(token, process.env.JWT_SECRET, null, (err, decoded) => {
      resolve(decoded);
    });
  });
  if (!verified) {
    res.status(401).json({
      status: 'error',
      error: 'Invalid authorization token'
    });
    return;
  }
  // Check if token has been invalidated by user logging out
  const isInvalid = await new Promise((resolve) => {
    InvalidToken.findByActual(token).then((invalid) => {
      resolve(invalid);
    });
  });
  if (isInvalid) {
    res.status(401).json({
      status: 'error',
      error: 'You need to be signed in to access this resource'
    });
    return;
  }
  const user = await new Promise((resolve) => {
    User.findByEmail(payload.email).then((item) => {
      resolve(item);
    });
  });
  if (user) {
    req.user = user;
    req.token = token;
    next();
  } else {
    res.status(404).json({
      status: 'error',
      error: 'User not found'
    });
  }
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {*} next
 * @returns {Promise<void>} protects routes and only gives access to verified users
 */
export const checkVerified = (req, res, next) => {
  const { user } = req;
  if (!user.isVerified) {
    res.status(400).json({
      status: 'error',
      error: 'Only verified users can access this resource'
    });
    return;
  }
  next();
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {*} next
 * @returns {Promise<void>} checks if the user is trying to edit their role and prevents them
 */
export const checkRoleChange = (req, res, next) => {
  const { body } = req;
  const containsRole = Object.keys(body).some((val) => val === 'role');
  if (containsRole) {
    res.status(400).json({
      status: 'error',
      error: 'You are not allowed to change roles'
    });
    return;
  }
  next();
};
