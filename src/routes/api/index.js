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
import ratingRouter from './rating';

const router = express.Router();

router.use('/auth', authRouter);

router.use('/profile', profileRouter);
router.use('/notification', checkToken, notificationRouter);
router.use('/trip', checkToken, tripRouter);

router.use('/request', checkToken, requestRouter);
router.use('/request', commentRouter);

router.use('/', roleRouter);
router.use('/', permissionRouter);
router.use('/like', likeRouter);

router.use('/', roleRouter);
router.use('/', permissionRouter);
router.user('/rating', checkToken, ratingRouter);
router.use('/rating', checkToken, ratingRouter);


router.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce((errors, key) => {
        errors[key] = err.errors[key].message;
        return errors;
      }, {})
    });
  }

  return next(err);
});

module.exports = router;
