import { Router } from 'express';
import { AuthController } from '../../controllers';
import emailValidation from '../../middlewares/Validations/emailValidation';
import passwordValidation from '../../middlewares/Validations/passwordValidator';
import { checkToken } from '../../middlewares';

const router = Router();

router.post('/signup', AuthController.signUp);
router.post('/verifyuser', AuthController.verifyUser);
router.post('/signin', AuthController.signIn);
router.post('/sendEmail', emailValidation, AuthController.sendEmail);
router.post('/resetPassword', passwordValidation, AuthController.resetPassword);
router.post('/logout', checkToken, AuthController.logout);


export default router;
