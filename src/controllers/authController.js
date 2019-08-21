/* eslint-disable require-jsdoc */
import generateToken from '../helpers/jwtHelper';
import verifyToken from '../middlewares/verifyToken';
import CommonHelper from '../helpers/commonHelper';
import sendVerificationMail from '../services/email';

import models from '../models';

const UserModel = models.User;

class AuthController extends CommonHelper {
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

        const payload = {
          firstName, lastName, email, password
        };
        const token = generateToken(payload);
        const location = process.env.BACKEND_URL;
        const url = '/verifyUser';
        const link = AuthController.generateEmailLink(location, url, token);
        const message = `<p>Thank you for registering. Please Click the link below to verify your Barefoot Nomad account</p><br />
         <a href=${link}>link</link>
         `;
        sendVerificationMail(email, 'Verify Your Email', message);

        return res.header('x-auth-token', token).status(201).json({
          status: 201,
          data: {
            id: newUser.id,
            token,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
          },
        });
      }
    } catch (error) {
      return res.status(500).json({ status: 500, error });
    }
  }

  static async verifyUser(req, res) {
    const { query: token } = req.query;
    const decodedToken = verifyToken(token); // create a verifytoken middware

    if (decodedToken.name === 'jsonWebTokenError' || decodedToken.name === 'TokenExpiredError') {
      return res.status(401).json({ status: 'error', message: 'Access denied, you are  not authorized to access this route' });
    }

    const user = await UserModel.update(
      {
        isVerified: true
      },
      { where: { id: decodedToken.id }, returning: true }
    );
    const { id, firstName, lastName, email, password, isVerified } = user[1][0];
    const payload = { id, firstName, lastName, email, password, isVerified };
    const newToken = generateToken(payload);

    return res.status(200).json({ 
      message: 'Client successfully verified',
      token: newToken
    });
  }
}

export default AuthController;
