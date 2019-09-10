import { Router } from 'express';
import allRoutes from './api';
import accommodationRouter from './accommodation';
import roomRouter from './room';

const router = Router();

router.use('/api/v1', allRoutes);
router.use('/api/v1', accommodationRouter);
router.use('/api/v1', roomRouter);

export default router;
