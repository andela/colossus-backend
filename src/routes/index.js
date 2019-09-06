import { Router } from 'express';

const router = Router();
const apiRoutes = require('./api');

router.use('/api/v1', apiRoutes);

export default router;
