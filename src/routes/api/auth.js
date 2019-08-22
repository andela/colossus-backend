import express from 'express';
import { AuthController } from '../../controllers';
import emailValidation from '../../middlewares/Validations/emailValidation';
import passwordValidation from '../../middlewares/Validations/passwordValidator';

const router = express.Router();

router.post('/signup', AuthController.signUp);
router.post('/signin', AuthController.signIn);
<<<<<<< HEAD
router.post('/sendEmail', emailValidation, AuthController.sendEmail);
router.post('/resetPassword', passwordValidation, AuthController.resetPassword);
=======
router.post('/verifyUser', AuthController.verifyUser);
<<<<<<< HEAD
>>>>>>> add email verification feature
=======
router.post('/verifyuser', AuthController.verifyUser);
>>>>>>> add unit & integration tests of  email verification capability

export default router;
