import model from '../models';
import isPermitted from '../helpers/isPermitted';
import actionToPermit from '../helpers/actionToPermit';
import checkToken from './auth';
import errorResponse from '../utils/index';

const { resource } = model;

export default async () => [
  // authenticate token and attach user to request object i.e., req.user
  checkToken(),

  async (req, res, next) => {
    const { roleId } = req.user;
    const action = await actionToPermit(req.method.toLowerCase());
    try {
      const resourceObject = await resource.findOne({
        where: {
          name: req.url.split('/')[1]
        }
      });
      const resourceId = resourceObject.dataValues.id;
      const actionIsAuthorized = await isPermitted(roleId, resourceId, action);
      if (actionIsAuthorized) return next();
      return errorResponse('Forbidden', res, 403);
    } catch (error) {
      return errorResponse(error, res, 400);
    }
  }
];
