import { Router } from 'express';
import { RatingController } from '../../controllers';
import validateRating from '../../middlewares/validateRating';

const router = Router();

router.post('/', validateRating, RatingController.createRating);

export default router;
