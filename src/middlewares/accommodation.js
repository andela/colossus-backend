import models from '../models';

const { Accommodation } = models;

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {*} next
 * @returns {Promise<void>} checks if a user has already booked accommodation and prevents them from booking another
 */
export const checkIfAlreadyBooked = async (req, res, next) => {
  const { user } = req;
  const accommodation = await new Promise((resolve) => {
    Accommodation.findWhereBookedBy(user.id).then((result) => {
      resolve(result);
    });
  });
  if (accommodation) {
    res.status(400).json({
      status: 400,
      error: `You already booked an accommodation with id ${accommodation.id}`
    });
    return;
  }
  next();
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {*} next
 * @returns {Promise<void>} checks if an accommodation has already been booked by someone else
 */
export const checkIfBooked = async (req, res, next) => {
  const { id } = req.query;
  const accommodation = await new Promise((resolve) => {
    Accommodation.findByPk(id).then((result) => {
      resolve(result);
    });
  });
  if (accommodation.booked) {
    res.status(400).json({
      status: 400,
      error: 'This accommodation has already been booked by someone else'
    });
    return;
  }
  next();
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {*} next
 * @returns {Promise<void>} checks if an accommodation was started by a user. Useful for routes that perform delete operations
 */
export const checkIfOwner = async (req, res, next) => {
  const { params, user } = req;
  const { id } = params;
  const accommodation = await new Promise((resolve) => {
    Accommodation.findByPk(id).then((result) => {
      resolve(result);
    });
  });
  if (accommodation.startedBy !== user.id) {
    res.status(400).json({
      status: 400,
      error: 'You can only delete accommodation services started by you'
    });
    return;
  }
  next();
};
