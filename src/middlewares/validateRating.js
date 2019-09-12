/* eslint-disable no-mixed-operators */
import errorResponse from '../utils/index';

export default (req, res, next) => {
  /**
     * @param {Object} req the trip request
     * @param {Object} res summary of the above request
     * @param {function} next pass control to next middleware
     * @description Validate the user's inputs and selections
     */
  const { rating, accommodationId } = req.body;

  try {
    const errors = [];
    if (!Object.prototype.hasOwnProperty.call(req.body, 'rating')) errors.push('The parameter "rating" is missing');
    if (!Object.prototype.hasOwnProperty.call(req.body, 'accommodationId')) errors.push('The parameter "accommodationId" is missing');
    if (typeof rating !== 'number') errors.push('The parameter "number" must be a number');
    if (typeof accommodationId !== 'number') errors.push('The parameter "accommodationId" must be a number');
    if (rating < 1 || rating > 5) errors.push('A rating can only be between 1 and 5');
    if (errors.length > 0) throw new Error(errors);
    return next();
  } catch (error) {
    return errorResponse(error, res, 400);
  }
};
