/* eslint-disable no-mixed-operators */
import errorResponse from '../utils/index';

export default (req, res, next) => {
  /**
     * @param {Object} req the trip request
     * @param {Object} res summary of the above request
     * @param {function} next pass control to next middleware
     * @description Validate the user's inputs and selections
     */
  const {
    reason, passportName, type,
    from, to, arrivalDate, departureDate, accommodation
  } = req.body;

  let stringValues = [reason, from, to, type, passportName, accommodation];

  try {
    const errors = [];
    if (!reason) errors.push('reason for travel is required');
    if (!passportName) errors.push('Your passport Name is required');
    if (!type) errors.push('you must specify type of trip; one-way or round-trip or multi-city');
    if (!from) errors.push('origin of travel is request required');
    if (!to) errors.push('destination of travel request is required');
    if (!departureDate) errors.push('departure Date for travel request is required');
    if (!accommodation) errors.push('accommodation arrangement for travel must be specified');


    if (type === 'one-way' && arrivalDate) errors.push('arrival date is NOT required for one way trip');
    if (type === 'round-trip' && !arrivalDate) errors.push('arrival date is required');

    if (type !== 'multi-city') {
      stringValues.forEach(value => {
        const notString = typeof value !== 'string';
        const withSpecialChar = /^(?=.*[!@#$%^&*])/.test(value);
        const message = 'you need to provide valid data for your travel request';
        if (notString || withSpecialChar && (errors.indexOf(message) === -1)) errors.push(message);
      });
    }

    if (type === 'multi-city') {
      stringValues = [reason, type, passportName];
      stringValues.forEach(value => {
        const notString = typeof value !== 'string';
        const withSpecialChar = /^(?=.*[!@#$%^&*])/.test(value);
        const message = 'you need to provide valid data for your travel request';
        if (notString || withSpecialChar && (errors.indexOf(message) === -1)) errors.push(message);
      });

      if (accommodation.length < 2) errors.push('All accommodation arrangements for this request must be specified');
      if (departureDate.length < 2) errors.push('You need to specify all depature dates for each request');
      if (from.length < 2) errors.push('You need to specify all destinations of your multicity travel request');
      if (to.length < 2) errors.push('You need to specify all destinations of your multicity travel request');
      if (from.length !== to.length) errors.push('All origins and destinations of your multicity request must be complete');
      if (departureDate.length !== from.length || departureDate.length !== to.length) {
        errors.push('departure dates does not correspond with origins or destinations of travel');
      }
      if (arrivalDate) errors.push('arrival date is not required for multi-city trips');
    }
    if (errors.length > 0) throw new Error(errors);
    return next();
  } catch (error) {
    return errorResponse(error, res, 400);
  }
};
