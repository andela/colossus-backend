/* eslint-disable require-jsdoc */
import models from '../models';
import errorResponse from '../utils/index';
import { eventEmitter } from '../services/websocket';

const { Comment, Notification, Request } = models;

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
      const { lineManagerId } = req.user;
      const { requestId } = req.params;

      const request = await Request.findOne({
        where: {
          id: requestId
        }
      });

      if (!request) return res.status(400).json({ 
        status: 'error', 
        message: 'This trip request does not exist'});
      
      const newComment = await Comment.create({
          commentBody, requestId, userId
      });  

      const { lineManagerId: managerId, userId: id } = request;

      const emitMessage = 'New Comment';

      const notificationData = {
        receiver: '',
        content: emitMessage,
        type: 'comment'
      };

      if (userId === managerId) { notificationData.receiver = id; } else { notificationData.receiver = lineManagerId; }

      await Notification.create(notificationData);

      eventEmitter(`commentAdded${notificationData.receiver}`, emitMessage);

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

      const commentRes = allComments.length === 0 ? 'No comments yet on this request' : allComments;

      res.status(200).json({
        status: 'success',
        data: commentRes
      });
    } catch (error) {
      res.status(500).json({ status: 'error', error: error.message });
    }
  }

  /**
    * @param {Objec} req the edited comment
    * @param {Object} res message to user
    * @returns {Object} success or failure to edit comment
    * @description Allow a user to edit a posted comment
    */
  static async editComment(req, res) {
    const { commentBody } = req.body;
    const { commentId } = req.params;
    const userId = req.user.id;
    try {
      let comment = await Comment.findOne({
        where: {
          id: commentId, userId
        }
      });

      if (!comment) return errorResponse(new Error('This comment doesn\'t exist'), res, 404);

      comment = await comment.update({ commentBody }, { returning: true });
      const patchedComment = comment.dataValues;

      return res.status(200).json({
        status: 'success',
        data: {
          message: 'Comment successfully updated',
          commentBody: patchedComment.commentBody,
          patcher: patchedComment.userId
        }
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
