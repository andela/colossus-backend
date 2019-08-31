/* eslint-disable no-mixed-operators */
import errorResponse from '../../utils/index';

export default (req, res, next) => {
  /**
     * @param {Object} req the trip request
     * @param {Object} res summary of the above request
     * @param {function} next pass control to next middleware
     * @description Validate the user's inputs and selections
     */
  const {
    reason, passportName, type, userId,
    from, to, arrivalDate, departureDate, accommodation
  } = req.body;

  try {
    const errors = [];
    if (!reason) errors.push('reason for travel is required');
    if (!passportName) errors.push('Your passport Name is required');
    if (!userId) errors.push('user Id is required');
    if (!type) errors.push('you must specify type of trip; one-way or round-trip or multi-city');
    if (!from) errors.push('origin of travel is request required');
    if (!to) errors.push('destination of travel request is required');
    if (!departureDate) errors.push('departure Date for travel request is required');
    if (!accommodation) errors.push('accommodation arrangement for travel must be specified');

    if (type === 'one-way' || type === 'round-trip' && from.length > 1) errors.push('only one origin of trip is required');
    if (type === 'one-way' || type === 'round-trip' && to.length > 1) errors.push('only one destination of trip is required');
    if (type === 'one-way' || type === 'round-trip' && departureDate.length > 1) errors.push('only one departure date is required');
    if (type === 'one-way' && arrivalDate) errors.push('arrival date is NOT required for one way trip');
    if (type === 'round-trip' && arrivalDate.length > 1) errors.push('only one arrival date required');
    if (type === 'round-trip' && !arrivalDate) errors.push('arrival date is required');

    if (type === 'multi-city' && from.length < 2) errors.push('You need to specify all origins of your multicity travel request');
    if (type === 'multi-city' && to.length < 2) errors.push('You need to specify all destinations of your multicity travel request');
    if (type === 'multi-city' && departureDate.length < 2) errors.push('You need to specify all depature dates for each request');
    if (type === 'multi-city' && arrivalDate.length < 2) errors.push('You need to specify all arrival dates for each request');
    if (type === 'multi-city' && !arrivalDate) errors.push('arrival date is required');

    if (errors.length > 0) throw new Error(errors);
    return next();
  } catch (error) {
    return errorResponse(error, res, 400);
  }
};
