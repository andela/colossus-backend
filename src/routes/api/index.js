import authRouter from './auth';

const router = require('express').Router();

router.use('/auth', authRouter);

module.exports = router;
