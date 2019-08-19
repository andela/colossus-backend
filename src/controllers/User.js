/* eslint-disable require-jsdoc */
import jwt from 'jsonwebtoken';
import { UserModel } from '../database/config';

class UserController {
  static async signup(req, res) {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
      } = req.body;
      // Check if the email already exists
      const user = UserModel.findOne({ where: { email, } });
      if (user) {
        res.status(400).json({ status: 400, error: 'Email already exists', });
      } else {
        // Password hash occurs in the hook beforeSave
        const newUser = UserModel.create({
          firstName,
          lastName,
          email,
          password, 
        });
        // Generate JWT
        const token = jwt.sign({ id: newUser.id, email, }, process.env.JWT_SECRET, { expiresIn: '50h' });
        return res.status(201).json({
          status: 201,
          data: {
            id: newUser.id,
            token,
            firstName,
            lastName,
            email,
          },
        });
      }
    } catch (error) {
      return res.status(500).json({ status: 500, error });
    }
  }
}

export default UserController;
