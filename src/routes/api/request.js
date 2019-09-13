import { Router } from 'express';
import { RequestController } from '../../controllers';
import { tripStatus as validateTripStatus, checkLineManagerId } from '../../middlewares/index';
import validateTripRequest from '../../middlewares/validateTripRequest';
import { checkToken } from '../../middlewares/auth';

const router = Router();


router.get('/', checkToken, RequestController.getAllRequests);

router.post('/', checkToken, checkLineManagerId, validateTripRequest, RequestController.createTrip);

router.get('/search', checkToken, RequestController.searchRequests);

router.patch('/:id', checkToken, validateTripRequest, RequestController.editRequest);

router.patch('/:requestId/status', checkToken, validateTripStatus, RequestController.updateStatus);

export default router;
