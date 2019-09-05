import models from '../models';

const { Accommodation } = models;

/**
 * Controller for CRUD operations related to accommodation
 * @author Kingsley Victor
 */
export default class AccommodationController {
  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>} creates an accommodation service
   */
  static async create(req, res) {
    try {
      const { type } = req.body;
      const picture = req.file;
      const data = await Accommodation.create({
        type,
        picture
      });
      res.status(201).json({
        status: 201,
        data
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error
      });
    }
  }

  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>} allows user to book an accommodation
   */
  static async bookOne(req, res) {
    try {
      const { user, query, body } = req;
      await Accommodation.book(
        query.id,
        user.id,
        body.movingIn,
        body.movingOut
      );
      const data = await Accommodation.findByPk(query.id);
      res.status(200).json({
        status: 200,
        data
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error
      });
    }
  }

  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>} rescinds a booking for accommodation
   */
  static async rescindOne(req, res) {
    try {
      const { user } = req;
      await Accommodation.rescind(user.id);
      res.status(200).json({
        status: 200,
        data: 'Successfully rescinded booking for accommodation'
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error
      });
    }
  }

  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>} gets all accommodations available for booking
   */
  static async getAll(req, res) {
    try {
      const data = await Accommodation.find({
        where: {
          booked: false
        }
      });
      res.status(200).json({
        status: 200,
        data
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error
      });
    }
  }

  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>} deletes an accommodation service
   */
  static async deleteOne(req, res) {
    try {
      const { id } = req.params;
      await Accommodation.destroy({
        where: {
          id
        }
      });
      res.status(200).json({
        status: 200,
        data: 'Successfully deleted accommodation service'
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error
      });
    }
  }
}
