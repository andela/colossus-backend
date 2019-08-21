import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

<<<<<<< HEAD
export const generateToken = (payload, secretKey = process.env.JWT_SECRET, duration = { expiresIn: '24hrs' }) => jwt.sign(payload, secretKey, duration);

export const decodeToken = (token) => jwt.verify(token, process.env.JWT_SECRET);
=======
const generateToken = 
(payload, secretKey = process.env.JWT_SECRET_KEY, duration = { expiresIn: '24hrs' }) => jwt.sign(payload, secretKey, duration);

export default generateToken;
>>>>>>> add email verification feature
