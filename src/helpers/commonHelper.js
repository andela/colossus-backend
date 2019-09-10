/* eslint-disable prefer-destructuring */
/* eslint-disable require-jsdoc */
import models from '../models';
import { eventEmitter } from '../services/websocket';
import sendVerificationMail from '../services/email';

const { Notification } = models;

class CommonHelper {
  /**
     * @param {String} location host environment
     * @param {String} url the host url
     * @param {String} token users's token
     * @description creates a random link to be sent to user
     */

  static generateEmailLink(location, url, token) {
    const link = `${location}${url}?query=${token}`;
    return link;
  }

  /**
     * @param {String} request request body
     * @param {Number} id id of the created request
     * @param {String} type type of the created request
     * @param {Boolean} bool true or false
     * @returns {Array} array containing all trip information
     * @description Generates trip information for a creating and updating trips
  */
  static generateTrips(request, id, type, bool) {
    const body = Object.entries(request);
    const Trips = [];

    const multiCity = body.filter(el => el[0] === 'from'
  || el[0] === 'to'
  || el[0] === 'departureDate'
  || el[0] === 'arrivalDate'
  || el[0] === 'accommodation'
  || el[0] === 'id');

    while (multiCity[0][1].length > 0) {
      const obj = {};
      multiCity.map(el => {
        obj[el[0]] = el[1][0];
        el[1].splice(0, 1);
        if (!bool) delete obj.id;
        return null;
      });
      if (type === 'one-way' || type === 'multi-city') obj.arrivalDate = null;
      obj.requestId = id;
      Trips.push(obj);
    }
    return Trips;
  }

  static async NotifyManagerForNewRequest(from, to, firstName, lastName, lineManagerId, type, appNotify, emailNotify, email) {
    const emitMessage = `New trip request from ${firstName} ${lastName}`;

    await Notification.create({
      receiver: lineManagerId,
      content: emitMessage,
      type: 'trip'
    });

    const emailMessage = `
    <h2>Hi, ${firstName} ${lastName},</h2>
    <p>Your ${type} trip to ${to} ${`from ${from}`} has been created</p>&nbsp;
    <p> You can view the  details on your <a href=${'ceratenotification'}>request page</a> </p>
   `;
    if (emailNotify) await sendVerificationMail(email, 'Trip Request Details', emailMessage);
    if (appNotify) eventEmitter(`tripCreated${lineManagerId}`, emitMessage);
  }
}

export default CommonHelper;
