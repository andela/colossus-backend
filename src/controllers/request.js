import models from '../models';

const { Request } = models;

/**
 *
 *
 * @class RequestController
 *
 */
export default class RequestController {
  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} res (server response)
   * @description get all travel requests
   */
  static async getAllRequests(req, res) {
    try {
      const allRequests = await Request.findAll({
        where: {
          userId: req.user.id
        }
      });
      return res.status(200).json({ status: 200, data: allRequests });
    } catch (error) {
      res.status(500).json({ status: 500, error });
    }
  }
}
