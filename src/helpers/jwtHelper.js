import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (payload, secretKey = process.env.JWT_SECRET, duration = { expiresIn: '24hrs' }) => jwt.sign(payload, secretKey, duration);

const decodeToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = {
  generateToken,
  decodeToken
};
