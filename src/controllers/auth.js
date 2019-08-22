/* eslint-disable require-jsdoc */
import jwt from 'jsonwebtoken';
import { compareSync } from 'bcryptjs';
import models from '../models';

const UserModel = models.User;

class AuthController {
  static async signUp(req, res) {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
      } = req.body;
        // Check if the email already exists
      const user = await UserModel.findOne({ where: { email, } });
      if (user) {
        res.status(400).json({ status: 400, error: 'Email already exists', });
      } else {
        // Password hash occurs in the hook beforeSave
        const newUser = await UserModel.create({
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

  static async signIn(req, res) {
    try {
      const {
        email,
        password,
      } = req.body;
      let user = await UserModel.findOne({ where: { email, } });
      // Check if the user does not exist
      if (!user) {
        return res.status(400).json({ status: 400, error: 'Unauthorized', });
      }
      user = user.dataValues;
      // Check if the password matches with the user's password in the db
      if (!compareSync(password, user.password)) {
        return res.status(400).json({ status: 400, error: 'Unauthorized', });
      }
      // Generate JWT
      const token = jwt.sign({ id: user.id, email, }, process.env.JWT_SECRET, { expiresIn: '50h' });
      return res.status(200).json({
        status: 200,
        data: {
          id: user.id,
          token,
          firstName: user.firstName,
          lastName: user.lastName,
          email,
        },
      });
    } catch (error) {
      return res.status(500).json({ status: 500, error });
    }
  }
}

export default AuthController;
