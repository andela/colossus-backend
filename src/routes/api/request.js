import { Router } from 'express';
import { RequestController } from '../../controllers';
import { tripStatus as validateTripStatus } from '../../middlewares';
import validateTripRequest from '../../middlewares/validateTripRequest';

const router = Router();

router.get('/', RequestController.getAllRequests);

router.get('/:userId', RequestController.getManagerRequest);

router.post('/', validateTripRequest, RequestController.createTrip);

router.patch('/:requestId/status', validateTripStatus, RequestController.updateStatus);

export default router;
