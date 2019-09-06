/* eslint-disable require-jsdoc */
import models from '../models';

const { Comment } = models;

export default class CommentController {
  /**
     * @param {Object} req the user's comment
     * @param {Object} res success or error object
     * @returns {Object} details of the posted comment
     * @description Post a new comment about a trip request made
     */
  static async postComment(req, res) {
    const { commentBody } = req.body;
    try {
      const userId = req.user.id;
      const { requestId } = req.params;

      const newComment = await Comment.create({
        commentBody, requestId, userId
      });
      res.status(201).json({
        status: 'success',
        data: {
          newComment: newComment.commentBody,
          'User ID': newComment.userId
        }
      });
    } catch (error) {
      res.status(500).json({ status: 'error', error: error.message });
    }
  }
}
