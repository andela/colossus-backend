import models from '../models';

const { Like } = models;

/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {*} next
 * @returns {Promise<void>} checks if a user had previously liked an accommodation facility and if they have, prevents them from liking it again
 */
export const checkIfPreviouslyLiked = async (req, res, next) => {
  const { user, params } = req;
  const { id } = params;
  const like = await new Promise((resolve) => {
    Like.findByUserAndAccommodation(user.id, id).then((result) => {
      resolve(result);
    });
  });
  if (like) {
    res.status(400).json({
      status: 'error',
      error: 'You previously liked this facility'
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
 * @returns {Promise<void>} checks if a user has liked an accommodation facility and if they have, it enables them unlike it
 */
export const checkIfUnlikeable = async (req, res, next) => {
  const { user, params } = req;
  const { id } = params;
  const like = await new Promise((resolve) => {
    Like.findByUserAndAccommodation(user.id, id).then((result) => {
      resolve(result);
    });
  });
  if (!like) {
    res.status(400).json({
      status: 'error',
      error: 'You have not previously liked this facility'
    });
    return;
  }
  next();
};
