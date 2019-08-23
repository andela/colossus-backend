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
const checkToken = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(400).json({
      status: 400,
      error: 'Authorization header not present in request'
    });
    return;
  }
  const token = authorization.split(' ')[1];
  if (!token) {
    res.status(401).json({
      status: 401,
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
      status: 401,
      error: 'Invalid authorization token'
    });
    return;
  }
  const isInvalid = await new Promise((resolve) => {
    InvalidToken.findByActual(token).then((invalid) => {
      resolve(invalid);
    });
  });
  if (isInvalid) {
    res.status(401).json({
      status: 401,
      error: 'User has signed out'
    });
    return;
  }
  const user = await new Promise((resolve) => {
    User.findByPk(payload.id).then((item) => {
      resolve(item);
    });
  });
  if (user) {
    req.user = user;
    req.token = token;
    next();
  } else {
    res.status(404).json({
      status: 404,
      error: 'User not found'
    });
  }
};

export default checkToken;
