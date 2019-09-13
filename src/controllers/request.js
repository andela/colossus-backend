import models from '../models';
import Helper from '../helpers/commonHelper';
import errorResponse from '../utils/index';
import { eventEmitter } from '../services/websocket';

const { generateTrips, NotifyManagerForNewRequest } = Helper;
const {
  Request, Trip, Notification, sequelize
} = models;

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
      const allRequests = await Request.findAll();
      return res.status(200).json({ status: 200, data: allRequests });
    } catch (error) {
      res.status(500).json({ status: 500, error });
    }
  }

  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} res (server response)
   * @description get all travel requests
   */
  static async getManagerRequest(req, res) {
    const { userId } = req.params;
    try {
      const allRequests = await Request.findAll({ where: { lineManagerId: userId } });
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
      const {
        reason, passportName, type, from, to,
      } = req.body;

      const origins = [...from];
      const destinations = [...to];

      const {
        lineManagerId, firstName, lastName, appNotify, emailNotify, email, id
      } = req.user;

      const request = await Request.create({
        reason, type, passportName, lineManagerId, userId: id
      });

      const Trips = generateTrips(req.body, request.id, type);

      await Trip.bulkCreate(Trips, { returning: true });

      const requestSummary = await Request.findOne({ where: { id: request.id }, include: { model: Trip, as: 'trips' } });

      await NotifyManagerForNewRequest(origins, destinations, firstName, lastName, lineManagerId, type, appNotify, emailNotify, email);

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

        const emitMessage = `Your request status have been ${status}`;

        await Notification.create({
          receiver: request.userId,
          content: emitMessage,
          type: 'status'
        });

        eventEmitter(`requestStatus${request.userId}`, emitMessage);

        res.status(200).json({ status: 200, data: status });
      } else {
        res.status(401).json({ status: 401, error: 'You are not the manager of the user' });
      }
    } catch (error) {
      res.status(500).json({ status: 500, error });
    }
  }

  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>} gets most travelled destinations
   */
  static async getMostTravelledDestination(req, res) {
    try {
      const item = await Trip.findAll({
        attributes: ['to', [sequelize.fn('COUNT', sequelize.col('to')), 'travels']],
        group: ['to'],
        raw: true,
        order: sequelize.literal('travels DESC'),
        limit: 1
      });
      const data = item[0];
      res.status(200).json({
        status: 'success',
        data
      });
    } catch ({ message }) {
      res.status(500).json({
        status: 500,
        error: message
      });
    }
  }

  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} res (server response)
   * @description Edits a request with a status of Open
   */
  static async editRequest(req, res) {
    const { body, params } = req;
    const {
      passportName, reason, type, managerId,
    } = body;

    const { lineManagerId, firstName, lastName } = req.user;

    try {
      const request = await Request.findByPk(params.id);

      if (!request) return errorResponse(new Error('Invalid requset Id'), res, 404);

      if (request.userId !== req.user.id) return errorResponse(new Error('You are not authorized to edit this request'), res, 403);

      if (request.status !== 'Open') return errorResponse(new Error('Only open requests can be edited'), res, 400);

      const Trips = generateTrips(req.body, request.id, type, true);

      const updateTrip = () => Trips.map(trip => Trip.upsert(trip));

      await Promise.all(updateTrip());

      await request.update({
        passportName, reason, type, managerId,
      });

      const emitMessage = `modified request from ${firstName} ${lastName}`;

      await Notification.create({
        receiver: lineManagerId,
        content: emitMessage,
        type: 'status'
      });

      eventEmitter(`requestModified${lineManagerId}`, emitMessage);

      const updateSummary = await Request.findOne({ where: { id: params.id }, include: { model: Trip, as: 'trips' } });

      res.status(200).json({ status: 200, data: updateSummary });
    } catch (error) {
      return errorResponse(error, res, 500);
    }
  }
}
