import { Router } from 'express';
import { AuthController } from '../../controllers';
import { Auth } from '../../middlewares';

const router = Router();
const auth = new Auth();
const authController = new AuthController();

router.post('/auth/logout', auth.checkToken, authController.logout);
