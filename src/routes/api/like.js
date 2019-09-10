import { Router } from 'express';
import {
  checkIfPreviouslyLiked, checkIfUnlikeable, checkToken, checkVerified
} from '../../middlewares';
import { LikeController } from '../../controllers';

const router = Router();

router.post(
  '/create/:id',
  checkToken,
  checkVerified,
  checkIfPreviouslyLiked,
  LikeController.like
);
router.delete(
  '/unlike/:id',
  checkToken,
  checkVerified,
  checkIfUnlikeable,
  LikeController.unlike
);
router.get(
  '/count/:id',
  checkToken,
  checkVerified,
  LikeController.count
);

export default router;
