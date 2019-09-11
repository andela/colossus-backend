import { Router } from 'express';

const router = Router();
router.use('/api/v1', require('./api'));

export default router;
