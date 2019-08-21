import express from 'express';
import authRouter from './auth';

<<<<<<< HEAD
const router = require('express').Router();

router.use('/auth', authRouter);
=======
const router = express.Router();

router.use('/auth', authRouter);

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
>>>>>>> add email verification feature

module.exports = router;
