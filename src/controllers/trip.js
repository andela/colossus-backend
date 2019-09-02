/* eslint-disable import/named */
/* eslint-disable require-jsdoc */
// TODO: Ask Ayo how if this should also be in a general export
import { generateEmailLinkForTrip, sendTripDetailsMail } from '../services/email';
import CommonHelper from '../helpers/commonHelper';


class TripController extends CommonHelper {
  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} the new user
   * @description register a new client
   */
  static async createTrip(req, res) {
    try {
      const user = {
        id: 1,
        managerId: 100,
        firstName: 'Tamunoibi',
        lastName: 'Aprekuma',
        email: 'ibitamuno432@gmail.com@yahoo.co.uk',
        inApp: true,
        emailNotification: true
      };
      const manager = {
        id: 100,
        managerId: 666,
        firstName: 'John',
        lastName: 'Doe',
        email: 'taprekuma@yahoo.co.uk',
        inAppNotification: true,
        emailNotification: true,
      };
      const tripDetails = {
        destinationCity: 'Toko',
        departureCity: 'Nigeria',
        reason,
type,
passportName,
managerId,
userId
      };
      const { destinationCity, departureCity } = tripDetails;

      const Notification = {};
      const {
        id, firstName, lastName, email, inAppNotification, emailNotification
      } = user;
      const managerId = manager.findOne(id);
      if (managerId) {
        if (emailNotification) {
          const location = process.env.FRONTEND_URL;
          const url = '/trips';
          const link = generateEmailLinkForTrip(location, url);
          const message = `
            <h2>Hi, ${firstName} ${lastName},</h2>
            <p>You one way trip from ${departureCity} to ${destinationCity} has been created</p>&nbsp;
            <p> You can view the  details on the <a href=${link}>request page</a> </p>
           `;


          await sendTripDetailsMail(email, 'Trip request details', message);
        }
        if (inAppNotification) {
          // await NotificationModel.create();
          const notification = await Notification.create({
            reason, type, passportName, managerId, userId
          });
          const notificationBody = { name: `${firstName} ${lastName}`, message: 'requests your approval for a trip' };
          await sendTripDetailsMail(managerId, notificationBody);
        }
      }
    } catch (error) {
      return res.status(500).json({ status: 500, error });
    }
  }
}

export default TripController;
