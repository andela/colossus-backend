/* eslint-disable import/named */
import { Router } from 'express';
import { CommentController } from '../../controllers';

const router = Router();

router.post('/:requestId/comment', CommentController.createComment);

export default router;
