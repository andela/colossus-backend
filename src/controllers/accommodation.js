import models from '../models';

const { Accommodation, sequelize } = models;

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
      const { ...values } = req.body;
      const data = await Accommodation.create({
        ...values,
        owner: req.user.id
      });
      return res.status(201).json({
        status: 'success',
        data
      });
    } catch (error) {
      return res.status(500).json({
        status: error,
        error: error.message
      });
    }
  }

  /**
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>} retrieves all accommodations
   */
  static async findAll(req, res) {
    try {
      const rawQueryString = `SELECT "Accommodation"."id", "Accommodation"."name", 
      "Accommodation"."location", "Accommodation"."image", "Accommodation"."owner",
      "Accommodation"."totalNumberOfRooms", COUNT("rooms") AS "spaceAvailable", "Accommodation"."description", "Accommodation"."cost",
      "Accommodation"."addOn", "Accommodation"."amenities", "Accommodation"."createdAt",
      "Accommodation"."updatedAt" FROM "Accommodation"
      AS "Accommodation" LEFT OUTER JOIN "Rooms" AS "rooms" ON "Accommodation"."id" = "rooms"."accommodationId"
      AND "rooms"."booked" = false GROUP BY "Accommodation"."id";`;
      const data = await sequelize.query(rawQueryString);
      return res.status(200).json({
        status: 'success',
        data: data[0],
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        error: error.message
      });
    }
  }

  /**
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>} deletes an accommodation
   */
  static async findOne(req, res) {
    try {
      const { accommodationId } = req.params;
      const rawQueryString = `SELECT "Accommodation"."id", "Accommodation"."name",
      "Accommodation"."location", "Accommodation"."image", "Accommodation"."owner",
      "Accommodation"."totalNumberOfRooms", COUNT("rooms") AS "spaceAvailable", "Accommodation"."description", "Accommodation"."cost",
      "Accommodation"."addOn", "Accommodation"."amenities", "Accommodation"."createdAt",
      "Accommodation"."updatedAt" FROM "Accommodation"
      AS "Accommodation" LEFT OUTER JOIN "Rooms" AS "rooms" ON "Accommodation"."id" = "rooms"."accommodationId"
      WHERE "Accommodation"."id" = ${accommodationId}
      AND "rooms"."booked" = false
      GROUP BY "Accommodation"."id";`;
      const data = await sequelize.query(rawQueryString);
      return res.status(200).json({
        status: 'success',
        data: data[0] || [],
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        error: error.message
      });
    }
  }

  /**
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>} deletes an accommodation
   */
  static async updateOne(req, res) {
    try {
      const { accommodationId } = req.params;
      const { ...body } = req.body;
      const data = await Accommodation.update({ ...body }, {
        where: {
          id: accommodationId
        },
        returning: true
      });
      return res.status(200).json({
        status: 'success',
        data: data[1][0].dataValues
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        error: error.message
      });
    }
  }

  /**
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
      return res.status(200).json({
        status: 'success',
        data: 'Successfully deleted accommodation'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        error: error.message
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
      return res.status(200).json({
        status: 'success',
        data
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
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
      return res.status(200).json({
        status: 'success',
        data: 'Successfully rescinded booking for accommodation'
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        error: error.message
      });
    }
  }
}
