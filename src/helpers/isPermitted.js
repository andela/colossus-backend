import permission from '../models';

export default async (roleId, resourceId, action) => {
  try {
    if (!roleId) throw new Error('You are unauthorized');

    const actionFound = await permission.findOne({
      attributes: [action],
      where: {
        roleId, resourceId
      }
    });
    if (!actionFound) throw new Error('You are unauthorized');
    const isActionPermitted = actionFound.dataValues.permissions;

    return isActionPermitted;
  } catch (error) {
    throw new Error(error.message);
  }
};
