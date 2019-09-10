import models from '../models';

const { Room, Rating } = models;


/**
 *
 *
 * @class RatingController
 *
 */
export default class RatingController {
  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} res (server response)
   * @description adds a rating for an accomodation
   */
  static async createRating(req, res) {
    try {
      const { rating, accommodationId } = req.body;
      // Determine if the user has booked a room with the accommodation
      const accommodation = 
    } catch (error) {
      res.status(500).json({ status: 500, error });
    }
  }
}
