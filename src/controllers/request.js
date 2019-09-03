import autoBind from 'auto-bind';
import models from '../models';
import generateTripDetails from '../helpers/commonHelper';
import { sendVerificationMail } from '../services/email';
// import { eventEmitter, onEvent } from '../services/websocket';


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
  * @param {Object} io
  * @returns {Object} res (server response)
  * @description get all travel requests
  */
  constructor(io) {
    this.io = io;
    autoBind(this);
  }

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
  async createTrip(req, res) {
    const { email, firstName, lastName } = req.user;

    try {
      let Trips = [];
      const {
        reason,
        passportName,
        managerId,
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
        managerId,
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

      const message = `
      <h2>Hi, ${firstName} ${lastName},</h2>
      <p>Your trip from ${from} to ${to} has been created</p>&nbsp;
      <p>Thank you for using our app</p>
     `;
      const emitMessage = `${firstName} ${lastName} Created a trip from ${from} to ${to}`;
      await sendVerificationMail(email, 'Trip request details', message);
      if (this.io) {
        this.io.emit(`${managerId}`, emitMessage);
      } else {
        console.log('I cannot can');
      }
      res.status(201).json({ status: 201, data: requestSummary });
    } catch (error) {
      console.log('REQUES=>', error);
      res.status(500).json({ status: 500, error });
    }
  }
}
