import models from '../models';

const { Accommodation } = models;

/**
 * Controller class for accommodation operations
 */
export default class AccomodationController {
  /**
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>} creates an accommodation
   */
  static async create(req, res) {
    try {
      const { name, location, image } = req.body;
      const data = await Accommodation.create({
        name,
        location,
        image,
        owner: req.user.id
      });
      res.status(201).json({
        status: 'success',
        data
      });
    } catch (error) {
      res.status(500).json({
        status: error,
        error: error.message
      });
    }
  }

  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>} retrieves all accommodations
   */
  static async findAll(req, res) {
    try {
      const data = await Accommodation.findAll();
      res.status(200).json({
        status: 'success',
        data
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        error: error.message
      });
    }
  }

  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>} deletes an accommodation
   */
  static async destroyOne(req, res) {
    try {
      const { accommodationId } = req.params;
      await Accommodation.destroy({
        where: {
          id: accommodationId
        }
      });
      res.status(200).json({
        status: 'success',
        data: 'Successfully deleted accommodation'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        error: error.message
      });
    }
  }
}
