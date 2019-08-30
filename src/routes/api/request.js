import { Router } from 'express';
import { RequestController } from '../../controllers';

const router = Router();

router.get('/', RequestController.getAllRequests);

export default router;