import { Router } from 'express';
import { RequestController } from '../../controllers';
<<<<<<< HEAD
import { tripStatus as validateTripStatus } from '../../middlewares/index';
import validateTripRequest from '../../middlewares/validateTripRequest';
import validateEditRequest from '../../middlewares/editRequestValidation';
=======
import validateTripRequest from '../../middlewares/Validations/validateTripRequest';
import validateRequestEdit from '../../middlewares/editRequestValidation';
>>>>>>> feat(edit-request): modify controller

const router = Router();

router.get('/', RequestController.getAllRequests);

router.post('/', validateTripRequest, RequestController.createTrip);

router.patch('/:id', validateEditRequest, RequestController.editRequest);

router.patch('/:requestId/status', validateTripStatus, RequestController.updateStatus);

<<<<<<< HEAD
=======
router.patch('/:id', validateRequestEdit, RequestController.editRequest);
>>>>>>> feat(edit-request): modify controller

export default router;
