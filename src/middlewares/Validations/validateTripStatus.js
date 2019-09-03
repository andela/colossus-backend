/* eslint-disable no-mixed-operators */
import errorResponse from '../../utils/index';

export default (req, res, next) => {
  /**
     * @param {Object} req the trip request
     * @param {Object} res summary of the above request
     * @param {function} next pass control to next middleware
     * @description Validate the user's inputs and selections
     */
  const { approved } = req.body;

  try {
    const errors = [];
    if (!approved) errors.push('The parameter "approved" is missing');
    if (typeof approved !== 'boolean') errors.push('The parameter "approved" must be a boolean');
    if (errors.length > 0) throw new Error(errors);
    return next();
  } catch (error) {
    return errorResponse(error, res, 400);
  }
};
