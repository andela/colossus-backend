import { Router } from 'express';
import { RoomController } from '../controllers';
import {
  checkToken, checkVerified, checkIfBooked, checkIfBookedBy
} from '../middlewares';
import { authorize } from '../middlewares/authorize';
import ValidateRoom from '../middlewares/validateRoom';
import checkAccommodationOwner from '../middlewares/checkAccommodationOwner';
import findRoom from '../middlewares/findRoom';
import findAccommodation from '../middlewares/findAccommodation';

const router = Router();

const { validateRoom } = ValidateRoom;

// create a room in an accommodation facility
router.post(
  '/accommodation/:accommodationId/room',
  checkToken,
  checkVerified,
  authorize,
  findAccommodation,
  checkAccommodationOwner,
  validateRoom,
  RoomController.create
);

// list all rooms in an accommodation
router.get(
  '/accommodation/:accommodationId/room',
  checkToken,
  checkVerified,
  findAccommodation,
  RoomController.findAllRooms
);

// delete a room in an accommodation
router.delete(
  '/accommodation/:accommodationId/room/:roomId',
  checkToken,
  checkVerified,
  authorize,
  findAccommodation,
  checkAccommodationOwner,
  findRoom,
  RoomController.destroyOne
);


router.patch(
  '/room/book/:id',
  checkToken,
  checkVerified,
  checkIfBooked,
  RoomController.bookOne
);

router.patch(
  '/room/rescind/:id',
  checkToken,
  checkVerified,
  checkIfBookedBy,
  RoomController.rescindOne
);
// update a room in an accommodation
router.patch(
  '/accommodation/:accommodationId/room/:roomId',
  checkToken,
  checkVerified,
  authorize,
  findAccommodation,
  checkAccommodationOwner,
  findRoom,
  RoomController.updateRoom
);

export default router;
