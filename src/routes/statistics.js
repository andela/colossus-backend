import { Router } from 'express';
import { RequestController } from '../controllers';
import { checkToken, checkVerified } from '../middlewares';

const router = Router();

router.get(
  '/destination/most_travelled',
  checkToken,
  checkVerified,
  RequestController.getMostTravelledDestination
);

export default router;
