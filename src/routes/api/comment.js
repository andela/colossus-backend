/* eslint-disable import/no-useless-path-segments */
import { Router } from 'express';
import { CommentController } from '../../controllers/';
import validateComment from '../../middlewares/validateComment';

const router = Router();

router.post('/:requestId/comment', validateComment, CommentController.postComment);
router.delete('/:requestId/comment/:commentId', CommentController.pseudoDeleteComment);

export default router;
