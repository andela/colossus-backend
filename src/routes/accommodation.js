import { Router } from 'express';
import { AccommodationController } from '../controllers';
import {
  checkToken, checkVerified, /* checkIfBooked, checkIfOwner */
} from '../middlewares';
import getImageFromRequest from '../middlewares/getImageFromRequest';
import ValidateAccommodation from '../middlewares/validateAccommodation';
import CloudinaryConfig from '../middlewares/cloudinaryConfig';
import ImageHandler from '../middlewares/imageHandler';
import { authorize } from '../middlewares/authorize';

const router = Router();

const { validateAccommodation } = ValidateAccommodation;
const { cloudinaryConfig } = CloudinaryConfig;
const { imageHandler } = ImageHandler;

router.post(
  '/accommodation',
  checkToken,
  checkVerified,
  authorize,
  getImageFromRequest,
  validateAccommodation,
  cloudinaryConfig,
  imageHandler,
  AccommodationController.create
);
// router.post(
//   '/book',
//   checkToken,
//   checkVerified,
//   checkIfBooked,
//   AccommodationController.bookOne
// );
// router.patch(
//   '/rescind',
//   checkToken,
//   checkVerified,
//   AccommodationController.rescindOne
// );
// router.get(
//   '/all',
//   checkToken,
//   AccommodationController.getAll
// );
// router.delete(
//   '/drop/:id',
//   checkToken,
//   checkVerified,
//   checkIfOwner,
//   AccommodationController.deleteOne
// );


export default router;
