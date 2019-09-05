/* eslint-disable import/no-useless-path-segments */
import { Router } from 'express';
import { CommentController } from '../../controllers/';
import validateComment from '../../middlewares/validateComment';

const router = Router();

router.post('/:requestId/comment', validateComment, CommentController.postComment);

export default router;
