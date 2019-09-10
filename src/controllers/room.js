import models from '../models';

const { Room } = models;

/**
 * Controller class for room operations
 */
export default class RoomController {
  /**
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>} creates a room
   */
  static async create(req, res) {
    try {
      const { name, type } = req.body;
      const { accommodationId } = req.params;
      const data = await Room.create({
        name,
        type,
        accommodationId,
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
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>} retrieves all rooms in an accommodation
   */
  static async findAllRooms(req, res) {
    try {
      const { accommodationId } = req.params;
      const data = await Room.findAll({
        where: {
          accommodationId
        }
      });
      res.status(200).json({
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
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>} retrieves all rooms in an accommodation
   */
  static async destroyOne(req, res) {
    try {
      const { accommodationId } = req.params;
      await Room.destroy({
        where: {
          id: accommodationId
        }
      });
      res.status(200).json({
        status: 'success',
        data: 'Successfully deleted room'
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
   * @returns {Promise<void>} books an accommodation
   */
  static async bookOne(req, res) {
    try {
      const { user, params } = req;
      const data = await Room.book(params.id, user.id);
      res.status(200).json({
        status: 'success',
        data
      });
    } catch ({ message }) {
      res.status(500).json({
        status: 'error',
        error: message
      });
    }
  }

  /**
   *
   * @param {Request} req
   * @param {Response} res
   * @returns {Promise<void>} rescinds booking an accommodation
   */
  static async rescindOne(req, res) {
    try {
      const { user, params } = req;
      const data = await Room.rescind(params.id, user.id);
      res.status(200).json({
        status: 'success',
        data
      });
    } catch ({ message }) {
      res.status(500).json({
        status: 'error',
        error: message
      });
    }
  }
}
