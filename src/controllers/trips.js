<<<<<<< HEAD
/* eslint-disable no-restricted-globals */
=======
>>>>>>> feat(edit-request): Create Endpoint To Update Requests
import models from '../models';
import errorResponse from '../utils/index';

const { Trip } = models;

/**
 *
 *
 * @class TripController
 *
 */
export default class TripController {
  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} res (server response)
<<<<<<< HEAD
   * @description delete a trip
   */
  static async deleteATrip(req, res) {
    try {
      if (isNaN(req.params.id)) return errorResponse(new Error('Invalid id supplied'), res, 400);

      const trip = await Trip.findByPk(req.params.id);

      if (!trip) return errorResponse(new Error('No trip with the stated id'), res, 404);

      await trip.destroy();

=======
   * @description get all travel requests
   */
  static async deleteATrip(req, res) {
    try {
      const trip = await Trip.findByPk(req.params.tripId);
      if (!trip) {
        return errorResponse(new Error('No trip with the stated id'), res, 404);
      }
      await Trip.destroy();
>>>>>>> feat(edit-request): Create Endpoint To Update Requests
      return res.status(200).json({ status: 200, message: 'Trip successfully deleted' });
    } catch (error) {
      return errorResponse(error, res, 500);
    }
  }
}
