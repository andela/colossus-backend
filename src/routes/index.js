import { Router } from 'express';
import { AuthRouter } from './api';

const WelcomeRouter = Router();
const MainRouter = Router();

WelcomeRouter.get('/', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'Welcome to Barefoot Nomad'
  });
});

MainRouter.use('/', WelcomeRouter);
MainRouter.use('/', AuthRouter);

export default MainRouter;
