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
import checkAccommodationOwner from '../middlewares/checkAccommodationOwner';

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

router.get(
  '/accommodation',
  checkToken,
  checkVerified,
  AccommodationController.findAll
);

router.delete(
  '/accommodation/:accommodationId',
  checkToken,
  checkVerified,
  authorize,
  checkAccommodationOwner,
  AccommodationController.destroyOne
);

export default router;
