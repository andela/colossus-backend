/* eslint-disable require-jsdoc */

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
     * @param {String} id id of the created request
     * @returns {Array} array containing all trip information
     * @description Generates trip information for a multi-city request
  */
  static generateTrips(request, id) {
    const body = Object.entries(request);
    const Trips = [];
    const multiCity = body.filter(el => el[0] === 'from'
    || el[0] === 'to'
    || el[0] === 'departureDate'
    || el[0] === 'accommodation');

    while (multiCity[0][1].length > 0) {
      const obj = {};
      multiCity.map(el => {
        // eslint-disable-next-line prefer-destructuring
        obj[el[0]] = el[1][0];
        el[1].splice(0, 1);
        return null;
      });
      obj.arrivalDate = null;
      obj.requestId = id;
      Trips.push(obj);
    }
    return Trips;
  }

  /**
     * @param {String} from location user is coming from
     * @param {String} to location user is going to
     * @param {String} arrivalDate expected return date
     * @param {String} departureDate expected departure date
     * @param {String} accommodation accomodation for a trip
     * @param {Object} id id of the created request
     * @returns {Array} array containing all trip information
     * @description Generates a trip's information for a one-way or round-trip
  */
  static generatesingleTrip(from, to, arrivalDate, departureDate, accommodation, id) {
    const obj = {};
    obj.from = from;
    obj.to = to;
    obj.arrivalDate = arrivalDate;
    obj.departureDate = departureDate;
    obj.accommodation = accommodation;
    obj.requestId = id;
    return obj;
  }
}

export default CommonHelper;
