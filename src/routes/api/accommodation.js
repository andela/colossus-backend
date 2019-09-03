import { Router } from 'express';
import { AccommodationController } from '../../controllers';
import {
  blob, checkToken, checkVerified, checkIfAlreadyBooked, checkIfBooked
} from '../../middlewares';
import multipart from '../../helpers/multipartHelper';

const router = Router();

router.post(
  '/create',
  checkToken,
  checkVerified,
  multipart.single('picture'),
  blob,
  AccommodationController.create
);
router.post(
  '/book',
  checkToken,
  checkVerified,
  checkIfAlreadyBooked,
  checkIfBooked,
  AccommodationController.bookOne
);
router.patch(
  '/rescind',
  checkToken,
  checkVerified,
  AccommodationController.rescindOne
);

export default router;
