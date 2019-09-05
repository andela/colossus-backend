import { Router } from 'express';
import { ProfileController } from '../../controllers';

const router = Router();

router.get('/:userId', ProfileController.getProfile);


export default router;
