import errorResponse from '../../utils/index';
import { decodeToken } from '../../helpers/jwtHelper';

/**
 *
 * @param {Object} req
 * @param {Object} res
 * @param {function} next
 * @returns {(function|Object)} function next() or an error response object
 * @description Handles validation for the password reset endpoint
 */
const checkForValidPassword = (req, res, next) => {
  const { query } = req.query;
  const { password, confirmPassword } = req.body;

  try {
    if (!query) throw new Error('You do not have rights to this resource');

    const { email } = decodeToken(query);

    const errors = [];

    if (!password || !confirmPassword) errors.push('password and confirm password are required');

    if ((password && confirmPassword) && (password !== confirmPassword)) errors.push('password and confirm password are not the same');

    if (password && !/^(?=.*[a-z])/.test(password)) errors.push('Password must contain at least one lower case character');

    if (password && !/^(?=.*[A-Z])/.test(password)) errors.push('Password must contain at least one upper case character');

    if (password && !/^(?=.*[0-9])/.test(password)) errors.push('Password must contain at least one number');

    if (password && !/^(?=.*[!@#$%^&*])/.test(password)) errors.push('Password must contain at least one special case character');

    if (password && !/^(?=.{8,})/.test(password)) errors.push('Password must contain at least 8 characters');

    if (password && /\s/.test(password)) errors.push('Password must not contain whitesepace');

    if (errors.length > 0) throw new Error(errors);

    req.email = email;

    return next();
  } catch (error) {
    return errorResponse(error, res, 400);
  }
};

export default checkForValidPassword;
