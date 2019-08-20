import { Router } from 'express';
import AuthRouter from './auth';

const router = Router();
const welcomeRouter = Router();

welcomeRouter.get('/', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'Welcome to Barefoot nomad'
  });
});

router.use('/', welcomeRouter);
router.use('/', AuthRouter);

export default router;
