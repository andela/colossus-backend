import { Router } from 'express';
import { AccommodationController } from '../../controllers';
import {
  blob, checkToken, checkVerified, checkIfBooked
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
  checkIfBooked,
  AccommodationController.bookOne
);
router.patch(
  '/rescind',
  checkToken,
  checkVerified,
  AccommodationController.rescindOne
);
router.get(
  '/all',
  checkToken,
  AccommodationController.getAll
);

export default router;
