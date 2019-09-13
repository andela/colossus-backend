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
      const { ...values } = req.body;
      const { accommodationId } = req.params;
      const data = await Room.create({
        ...values,
        accommodationId,
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
      return res.status(200).json({
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
   * @returns {Promise<void>} retrieves all rooms in an accommodation
   */
  static async updateRoom(req, res) {
    try {
      const { accommodationId, roomId } = req.params;
      const { ...body } = req.body;
      const data = await Room.update({ ...body }, {
        where: {
          id: roomId,
          accommodationId
        },
        returning: true
      });
      return res.status(200).json({
        status: 'success',
        data: data[1][0].dataValues
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
   * @returns {Promise<void>} deletes one room in an accommodation
   */
  static async destroyOne(req, res) {
    try {
      const { accommodationId } = req.params;
      await Room.destroy({
        where: {
          id: accommodationId
        }
      });
      return res.status(200).json({
        status: 'success',
        data: 'Successfully deleted room'
      });
    } catch (error) {
      return res.status(500).json({
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
      const item = await Room.book(params.id, user.id);
      res.status(200).json({
        status: 'success',
        data: item[1][0]
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
      const item = await Room.rescind(params.id, user.id);
      res.status(200).json({
        status: 'success',
        data: item[1][0]
      });
    } catch ({ message }) {
      res.status(500).json({
        status: 'error',
        error: message
      });
    }
  }
}
