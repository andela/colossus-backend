// import model from '../models';

// const { Permission } = model;

// export default async (role, resource, action) => {
//   try {
//     if (!role) throw new Error('You are unauthorized. Contact the Administrator');

//     const actionFound = await Permission.findOne({
//       attributes: [action],
//       where: {
//         role, resource
//       }
//     });
//     console.log('actionFound::', actionFound);
//     if (!actionFound) throw new Error('You are unauthorized. Contact the Administrator');
//     const isActionPermitted = actionFound.dataValues.permissions;
//     return isActionPermitted;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };
