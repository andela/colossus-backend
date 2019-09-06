import { Router } from 'express';
import { NotificationController } from '../../controllers';

const router = Router();

// api/v1/notification is already prepended to the request
router.get('/:userId', NotificationController.getAllNotification);
router.patch('/:userId', NotificationController.readAllNotification);


export default router;
