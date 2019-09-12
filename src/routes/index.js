import { Router } from 'express';
import allRoutes from './api';
import accommodationRouter from './accommodation';
import roomRouter from './room';

const router = Router();

router.use('/', allRoutes);

router.use('/', accommodationRouter);

router.use('/', roomRouter);

export default router;
