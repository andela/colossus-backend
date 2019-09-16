/* eslint-disable no-mixed-operators */
import helpers from '../helpers/Helpers';


const { extractErrors } = helpers;

export default (req, res, next) => {
  /**
     * @param {Object} req the user feedback
     * @param {Object} res summary of the above feedback
     * @param {function} next pass control to next middleware
     * @description Validate the user's feedback inputs
     */
  req
    .checkParams('accommodationId', 'The accommodation ID must be a number')
    .notEmpty()
    .isInt();
  const errors = req.validationErrors();
  if (errors) {
    return res.status(400).json({
      status: 'error',
      error: extractErrors(errors),
    });
  }
  return next();
};
