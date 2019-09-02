import express from 'express';
import authRouter from './auth';
import requestRouter from './request';
import { checkToken } from '../../middlewares';
import ProfileController from '../../controllers/profile';


const { getProfile } = ProfileController;

const router = express.Router();

router.use('/auth', authRouter);
router.get('/profile/:userId', getProfile);
router.use('/request', checkToken, requestRouter);

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
