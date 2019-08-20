import { Router } from 'express';
import { Auth } from '../middlewares';
import { AuthController } from '../controllers';

const router = Router();
const auth = new Auth();
const controller = new AuthController();

router.post('/auth/logout', auth.checkToken, controller.logout);

export default router;
