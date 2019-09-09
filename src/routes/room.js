import { Router } from 'express';
import { RoomController } from '../controllers';
import {
  checkToken, checkVerified,
} from '../middlewares';
import { authorize } from '../middlewares/authorize';
import ValidateRoom from '../middlewares/validateRoom';
import checkAccommodationOwner from '../middlewares/checkAccommodationOwner';

const router = Router();

const { validateRoom } = ValidateRoom;

router.post(
  '/accommodation/:accommodationId/room',
  checkToken,
  checkVerified,
  authorize,
  checkAccommodationOwner,
  validateRoom,
  RoomController.create
);

router.get(
  '/accommodation/:accommodationId/room',
  checkToken,
  checkVerified,
  RoomController.findAllRooms
);

router.delete(
  '/accommodation/:accommodationId/room/:roomId',
  checkToken,
  checkVerified,
  authorize,
  checkAccommodationOwner,
  RoomController.destroyOne
);

export default router;
