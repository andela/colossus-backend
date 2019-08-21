import { Router } from 'express';
import { AuthController } from '../../controllers';
import { Auth } from '../../middlewares';

const router = Router();

router.post('/signup', AuthController.signUp);
router.post('/logout', Auth.checkToken, AuthController.logout);

export default router;
