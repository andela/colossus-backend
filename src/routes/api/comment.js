import { Router } from 'express';
import { CommentController } from '../../controllers/';
import validateComment from '../../middlewares/validateComment';

const router = Router();

router.post('/:requestId/comment', validateComment, CommentController.postComment);
router.get('/:requestId/comment', CommentController.getComments);
router.patch('/:requestId/comment/:commentId', validateComment, CommentController.editComment);
router.delete('/:requestId/comment/:commentId', CommentController.pseudoDeleteComment);

export default router;
