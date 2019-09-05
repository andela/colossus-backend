import { Router } from 'express';
import { RequestController } from '../../controllers';
import validateTripRequest from '../../middlewares/Validations/validateTripRequest';

const router = Router();

router.get('/', RequestController.getAllRequests);


router.post('/', validateTripRequest, RequestController.createTrip);

export default router;
