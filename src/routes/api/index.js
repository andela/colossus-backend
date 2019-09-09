import express from 'express';
import authRouter from './auth';
import requestRouter from './request';
import profileRouter from './profile';
import likeRouter from './like';
import { checkToken } from '../../middlewares';
import permissionRouter from './permission';
import roleRouter from './role';
import notificationRouter from './notification';
import commentRouter from './comment';
import tripRouter from './trip';

const router = express.Router();

router.use('/auth', authRouter);

router.use('/profile', profileRouter);
router.use('/notification', checkToken, notificationRouter);
router.use('/trip', checkToken, tripRouter);

router.use('/request', checkToken, requestRouter);
router.use('/request', commentRouter);

router.use('/', roleRouter);
router.use('/', permissionRouter);
<<<<<<< HEAD
router.use('/like', likeRouter);
=======

router.use('/accommodation', accommodationRouter);
router.use('/', roleRouter);
router.use('/', permissionRouter);
>>>>>>> feat(edit-request): Create and endpoint for a user to edit the details of a request

module.exports = router;
