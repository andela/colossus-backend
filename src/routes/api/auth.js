import { Router } from 'express';
import { AuthController } from '../../controllers';
import AuthValidator from '../../middlewares/inputVaidator';
import emailValidation from '../../middlewares/Validations/emailValidation';
import passwordValidation from '../../middlewares/Validations/passwordValidator';
import { checkToken } from '../../middlewares';

const router = Router();

// router.post('/signup', AuthController.signUp);
router.post('/signup', AuthValidator.validateSignUp, AuthController.signUp);
router.post('/verifyuser', AuthValidator.validateSignIn, AuthController.verifyUser);
router.post('/signin', AuthController.signIn);
router.post('/sendEmail', emailValidation, AuthController.sendEmail);
router.post('/resetPassword', passwordValidation, AuthController.resetPassword);
router.post('/logout', checkToken, AuthController.logout);


export default router;
