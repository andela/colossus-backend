import models from '../models';
import generateTripDetails from '../helpers/commonHelper';
import { eventEmitter } from '../services/websocket';
import sendVerificationMail from '../services/email';

const { generateTrips, generatesingleTrip } = generateTripDetails;
const { Request, Trip, Notification } = models;

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
        type,
        from,
        to,
        arrivalDate,
        departureDate,
        accommodation
      } = req.body;
      const userId = req.user.id;
      const {
        lineManagerId, firstName, lastName, appNotify, emailNotify, email
      } = req.user;
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
      const emitMessage = `New trip request from ${firstName} ${lastName}`;

      await Notification.create({
        receiver: lineManagerId,
        content: emitMessage,
        type: 'trip'
      });

      const emailMessage = `
      <h2>Hi, ${firstName} ${lastName},</h2>
      <p>Your ${type === 'one-way' ? `${type} trip` : type} to ${to} ${`from ${from}` || ''} has been created</p>&nbsp;
      <p> You can view the  details on your <a href=${'ceratenotification'}>request page</a> </p>
     `;
      if (emailNotify) await sendVerificationMail(email, 'Trip Request Details', emailMessage);
      if (appNotify) eventEmitter(`tripCreated${lineManagerId}`, emitMessage);
      res.status(201).json({ status: 201, data: requestSummary });
    } catch (error) {
      console.log('REQUES=>', error);
      res.status(500).json({ status: 500, error });
    }
  }
}
