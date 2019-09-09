import express from 'express';
import authRouter from './auth';
import requestRouter from './request';
import accommodationRouter from './accommodation';
import profileRouter from './profile';
import notificationRouter from './notification';
import { checkToken } from '../../middlewares';
import permissionRouter from './permission';
import roleRouter from './role';
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

router.use('/accommodation', accommodationRouter);
router.use('/', roleRouter);
router.use('/', permissionRouter);

module.exports = router;
