import { Router } from 'express';
import { RequestController } from '../../controllers';
import { tripStatus as validateTripStatus, checkLineManagerId } from '../../middlewares/index';
import validateTripRequest from '../../middlewares/validateTripRequest';

const router = Router();


router.get('/', RequestController.getAllRequests);

router.get('/search', RequestController.searchRequests);

router.post('/', validateTripRequest, RequestController.createTrip);

router.patch('/:id', validateTripRequest, RequestController.editRequest);

router.patch('/:requestId/status', validateTripStatus, RequestController.updateStatus);

export default router;
