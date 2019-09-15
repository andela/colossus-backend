/* eslint-disable require-jsdoc */
import models from '../models';

const { AccommodationFeedback } = models;

export default class FeedbackController {
  /**
     * @param {Object} req the user's feedback
     * @param {Object} res success or error object
     * @returns {Object} details of the posted feedback
     * @description Post a new feedback about an accommodation
     */
  static async postFeedback(req, res) {
    try {
      const userId = req.user.id;
      const { feedbackBody } = req.body;
      const { accommodationId } = req.params;
      const newFeedback = await AccommodationFeedback.create({
        feedbackBody, accommodationId, userId
      });


      res.status(201).json({
        status: 'success',
        data: {
          newFeedback: newFeedback.feedbackBody,
          'User ID': newFeedback.userId
        }
      });
    } catch (error) {
      res.status(500).json({ status: 'error', error: error.message });
    }
  }
}
