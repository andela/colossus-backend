import { Router } from 'express';
import apiRouter from './api';

const router = Router();
const foo = (io = null) => router.use('/api/v1', apiRouter(io));


export default foo;
