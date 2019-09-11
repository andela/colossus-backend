import { Router } from 'express';
import allRoutes from './api';
import accommodationRouter from './accommodation';
import roomRouter from './room';
import statsRouter from './statistics';

const router = Router();

router.use('/', allRoutes);
router.use('/', accommodationRouter);
router.use('/', roomRouter);
router.use('/', statsRouter);

export default router;
