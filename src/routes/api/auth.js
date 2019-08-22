import express from 'express';
import { AuthController } from '../../controllers';

const router = express.Router();

router.post('/signup', AuthController.signUp);
router.post('/signin', AuthController.signIn);

export default router;
