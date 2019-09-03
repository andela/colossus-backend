import { Router } from 'express';
import { RequestController, } from '../../controllers';
import validateTripRequest from '../../middlewares/Validations/validateTripRequest';


const router = Router();

const foo = (io = null) => {
  const notifyUs = new RequestController(io);
  router.get('/', RequestController.getAllRequests);

  router.post('/', validateTripRequest, notifyUs.createTrip);

  return router;
};


export default foo;
