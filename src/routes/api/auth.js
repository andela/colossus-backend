import express from 'express';
import { AuthController } from '../../controllers';
import emailValidation from '../../middlewares/Validations/emailValidation';
import passwordValidation from '../../middlewares/Validations/passwordValidator';

const router = express.Router();

router.post('/signup', AuthController.signUp);
router.post('/verifyuser', AuthController.verifyUser);
router.post('/signin', AuthController.signIn);
router.post('/sendEmail', emailValidation, AuthController.sendEmail);
router.post('/resetPassword', passwordValidation, AuthController.resetPassword);

import AuthValidator from '../../middlewares/inputVaidator';



const router = express.Router();

router.post('/signup', AuthValidator.validateSignUp, AuthController.signUp);

export default router;
