import { Router } from 'express';
import { RequestController } from '../../controllers';
import validateTripRequest from '../../middlewares/Validations/validateTripRequest';
import { tripStatus as validateTripStatus } from '../../middlewares/index';

const router = Router();

router.get('/', RequestController.getAllRequests);

router.post('/', validateTripRequest, RequestController.createTrip);

router.patch('/:requestId/status', validateTripStatus, RequestController.updateStatus);

export default router;
