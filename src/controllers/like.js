import models from '../models';

const { Like } = models;

/**
 * Performs operations intrinsic to the like model
 * @author Kingsley Victor
 */
export default class LikeController {
  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>} likes an accommodation facility
   */
  static async like(req, res) {
    try {
      const { user, params } = req;
      const data = await Like.create({
        likedBy: user.id,
        accommodationId: params.id
      });
      res.status(201).json({
        status: 'success',
        data
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        error
      });
    }
  }

  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>} unlikes an accommodation facility
   */
  static async unlike(req, res) {
    try {
      const { user, params } = req;
      const deleteCount = await Like.deleteByUserAndAccommodation(
        user.id,
        params.id
      );
      res.status(200).json({
        status: 'success',
        data: `${deleteCount} item(s) deleted`
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        error
      });
    }
  }

  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>} count number of likes an accommodation facility has
   */
  static async count(req, res) {
    try {
      const { id } = req.params;
      const data = await Like.countByAccommodation(id);
      res.status(200).json({
        status: 'success',
        data
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        error
      });
    }
  }
}
