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

  /**
   * @param {Object} req
   * @param {Object} res the response on failure object
   * @returns {Array} the array of comments
   * @description view all comment(s) relating to a request
   */
  static async getComments(req, res) {
    const { requestId } = req.params;
    try {
      const allComments = await Comment.findAll({
        where: {
          requestId
        }
      });
      res.status(200).json({
        status: 'success',
        data: allComments
      });
    } catch (error) {
      res.status(500).json({ status: 'error', error: error.message });
    }
  }

  /**
   * @param {Object} req the unwanted comment to be removed
   * @param {Object} res successfully deleted comment or failure object
   * @returns {void}
   * @description gives a user ability to delete THEIR unwanted comment(s) about a request.
   */
  static async pseudoDeleteComment(req, res) {
    const { commentId } = req.params;
    const commentOwner = req.user.id;
    try {
      const comment = await Comment.findOne({
        where: {
          id: commentId
        }
      });
      if (comment.userId !== commentOwner) {
        return res.status(401).json({
          status: 'error',
          message: 'you are not the owner of this comment'
        });
      }
      const deletedAt = Date.now();
      await Comment.update({ deletedAt }, {
        where: {
          id: commentId
        }
      });
      res.status(200).json({
        status: 'success',
        data: {
          message: 'Comment succesfully deleted'
        }
      });
    } catch (error) {
      res.status(500).json({ status: 'error', error: error.message });
    }
  }
}
