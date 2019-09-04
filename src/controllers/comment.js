/* eslint-disable require-jsdoc */
import models from '../models';

const { Comment, Request } = models;

export default class CommentController {
  /**
     * @param {Object} req the user's comment
     * @param {Object} res success or error object
     * @returns {Object} details of the posted comment
     * @description Post a new comment about a trip request made
     */
  static async createComment(req, res) {
    const { commentBody } = req.body;
    const userId = req.user.id;
    try {
      const request = await Request.findAll(
        where: {
            userId
          }
      );
      if (!request) {
        res.status(404).json({ status: 'error', message: 'This request does not exist' });
      }
      const { id } = request;

      const newComment = await Comment.create({
        commentBody, userId, id
      });
      res.status(201).json({
        status: 'success',
        data: {
          newComment: newComment.commentBody
        }
      });
    } catch (error) {
      res.status(500).json({ status: 500, error });
    }
  }
}
