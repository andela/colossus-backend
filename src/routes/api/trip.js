import { Router } from 'express';
import { TripController } from '../../controllers';

const router = Router();

router.delete('/:id', TripController.deleteATrip);

export default router;
