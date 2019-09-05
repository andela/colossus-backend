import models from '../models';

const { Accommodation } = models;

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {*} next
 * @returns {Promise<void>} checks if an accommodation has already been booked
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
      error: 'This accommodation has already been booked'
    });
    return;
  }
  next();
};
