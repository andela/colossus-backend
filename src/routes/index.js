import { Router } from 'express';
import allRoutes from './api';
import accommodationRouter from './accommodation';

const router = Router();

router.use('/api/v1', allRoutes);
router.use('/api/v1', accommodationRouter);

export default router;
