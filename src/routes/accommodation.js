import { Router } from 'express';
import { AccommodationController, AccommodationFeedbackController } from '../controllers';
import { checkToken, checkVerified } from '../middlewares';
import getImageFromRequest from '../middlewares/getImageFromRequest';
import ValidateAccommodation from '../middlewares/validateAccommodation';
import validateAccommodationFeedback from '../middlewares/validateAccommodationFeedback';
import CloudinaryConfig from '../middlewares/cloudinaryConfig';
import { authorize } from '../middlewares/authorize';
import ImageHandler from '../middlewares/imageHandler';
import checkAccommodationOwner from '../middlewares/checkAccommodationOwner';
import findAccommodation from '../middlewares/findAccommodation';

const router = Router();

const { validateAccommodation } = ValidateAccommodation;

const { cloudinaryConfig } = CloudinaryConfig;

const { imageHandler } = ImageHandler;


// api/v1 is already prepended to the request
router.post(
  '/accommodation/:accommodationId/feedback',
  checkToken,
  checkVerified,
  validateAccommodationFeedback,
  AccommodationFeedbackController.postFeedback
);

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

router.get(
  '/accommodation/:accommodationId',
  checkToken,
  checkVerified,
  AccommodationController.findOne
);

router.patch(
  '/accommodation/:accommodationId',
  checkToken,
  checkVerified,
  authorize,
  findAccommodation,
  checkAccommodationOwner,
  AccommodationController.updateOne
);

router.delete(
  '/accommodation/:accommodationId',
  checkToken,
  checkVerified,
  authorize,
  findAccommodation,
  checkAccommodationOwner,
  AccommodationController.destroyOne
);

export default router;
