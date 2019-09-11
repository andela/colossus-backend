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
      const bookedRoom = await Room.findOne({
        where: {
          bookedBy: req.user.id,
          accommodationId,
        }
      });
      if (!bookedRoom) return res.status(401).json({ status: 401, error: 'You have not booked this accommodation' });
      // Add the new rating for the accommodation
      // Check if the accommodation already has a rating
      const accommodationHasRating = await Rating.findOne({ where: { accommodationId } });
      if (accommodationHasRating) {
        const accommodation = accommodationHasRating;
        const previousRatingSum = accommodation.averageRating * accommodation.numberOfRatings;
        const newAverageRating = (previousRatingSum + rating) / (accommodation.numberOfRatings + 1);
        const updatedRating = await Rating.update({
          averageRating: newAverageRating,
          numberOfRatings: accommodation.numberOfRatings + 1 // change data type in the db to float
        },
        {
          where: {
            accommodationId
          },
          returning: true
        });
        res.status(200).json({ status: 200, data: updatedRating[1][0] });
      } else {
        const newAverageRating = await Rating.create({
          accommodationId,
          averageRating: rating,
          numberOfRatings: 1,
        });
        res.status(200).json({ status: 200, data: newAverageRating });
      }
    } catch (error) {
      res.status(500).json({ status: 500, error });
    }
  }
}
