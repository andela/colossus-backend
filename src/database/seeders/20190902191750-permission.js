export default {
  up: (queryInterface) => queryInterface.bulkInsert('Roles', [
    {
      id: 1,
      create: true,
      read: true,
      update: true,
      delete: true,
      roleId: 1,
      resourceId: 1
    }
  ], {}),

  down: (queryInterface) => queryInterface.bulkDelete('Roles', null, {})
};
