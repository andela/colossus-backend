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
      error: `You have already booked an accommodation with id ${accommodation.id}`
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
