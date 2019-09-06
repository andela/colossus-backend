/* eslint-disable no-mixed-operators */
import errorResponse from '../utils/index';

export default (req, res, next) => {
  /**
     * @param {Object} req the user comment
     * @param {Object} res summary of the above comment
     * @param {function} next pass control to next middleware
     * @description Validate the user's comment inputs
     */
  const {
    commentBody
  } = req.body;

  try {
    const errors = [];
    if (!commentBody) errors.push('comment cannot be empty');
    if (typeof commentBody !== 'string') errors.push('you must provide a valid comment to register one');

    if (errors.length > 0) throw new Error(errors);
    return next();
  } catch (error) {
    return errorResponse(error, res, 400);
  }
};
