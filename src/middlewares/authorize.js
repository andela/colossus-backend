import model from '../models';
import actionToPermit from '../helpers/actionToPermit';

const { Permission } = model;

export const authorize = async (req, res, next) => {
  try {
    const { role } = req.user;
    const action = await actionToPermit(req.method.toLowerCase());
    const resource = req.url.split('/')[1];
    const isPermittedObject = await Permission.findOne({
      attributes: [action],
      where: {
        role, resource
      }
    });
    if (!isPermittedObject) throw new Error('You are unauthorized. Contact the Administrator');
    const actionIsAuthorized = isPermittedObject.dataValues[action];
    if (!actionIsAuthorized) throw new Error('You are unauthorized. Contact the Administrator');
    next();
  } catch (error) {
    return res.status(403).json({
      status: 'error',
      error: error.message
    });
  }
};
