import models from '../models';

const { Room } = models;

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {*} next
 * @returns {Promise<void>} checks if an accommodation has already been booked
 */
export const checkIfBooked = async (req, res, next) => {
  const { id } = req.params;
  const accommodation = await new Promise((resolve) => {
    Room.findByPk(id).then((result) => {
      resolve(result);
    });
  });
  if (accommodation.booked) {
    res.status(400).json({
      status: 'error',
      error: 'This accommodation has already been booked'
    });
    return;
  }
  next();
};
