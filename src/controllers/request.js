import models from '../models';
import generateTripDetails from '../helpers/commonHelper';

const { generateTrips, generatesingleTrip } = generateTripDetails;
const { Request, Trip } = models;

/**
 *
 *
 * @class RequestController
 *
 */
export default class RequestController {
  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} res (server response)
   * @description get all travel requests
   */
  static async getAllRequests(req, res) {
    try {
      const allRequests = await Request.findAll({
        where: {
          userId: req.user.id
        }
      });
      return res.status(200).json({ status: 200, data: allRequests });
    } catch (error) {
      res.status(500).json({ status: 500, error });
    }
  }

  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} res (server response)
   * @description Creates a new request with the associated trips
   */
  static async createTrip(req, res) {
    try {
      let Trips = [];
      const {
        reason,
        passportName,
        lineManagerId,
        type,
        from,
        to,
        arrivalDate,
        departureDate,
        accommodation
      } = req.body;
      const userId = req.user.id;
      const request = await Request.create({
        reason,
        type,
        passportName,
        lineManagerId,
        userId
      });

      const { id } = request;

      const obj = generatesingleTrip(
        from,
        to,
        arrivalDate,
        departureDate,
        accommodation,
        id
      );

      if (type === 'one-way') obj.arrivalDate = null;

      Trips.push(obj);

      if (type === 'multi-city') Trips = generateTrips(req.body, id);

      await Trip.bulkCreate(Trips, { returning: true });

      const requestSummary = await Request.findOne({
        where: { id },
        include: { model: Trip, as: 'trips' }
      });

      res.status(201).json({ status: 201, data: requestSummary });
    } catch (error) {
      res.status(500).json({ status: 500, error });
    }
  }

  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} res (server response)
   * @description rejects/approves a travel request
   */
  static async updateStatus(req, res) {
    const requestingManagerId = req.user.id;
    const { requestId } = req.params;
    try {
      // Check if the person making the update is the manager tied to the request
      const request = await Request.findOne({
        where: {
          id: requestId
        }
      });
      if (request.lineManagerId === requestingManagerId) {
        const status = req.body.approved ? 'approved' : 'rejected';
        await Request.update({ status }, {
          where: {
            id: requestId
          }
        });
        res.status(200).json({ status: 200, data: status });
      } else {
        res.status(401).json({ status: 401, error: 'You are not the manager of the user' });
      }
    } catch (error) {
      res.status(500).json({ status: 500, error });
    }
  }
}
